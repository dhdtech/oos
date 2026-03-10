import os
import re
import uuid
import base64
import secrets
import string

from flask import Flask, request, jsonify
from flask_cors import CORS
import redis

app = Flask(__name__)
CORS(app)

MAX_CIPHERTEXT_SIZE = 100 * 1024  # 100KB
ALIAS_ALPHABET = string.ascii_letters + string.digits
ALIAS_LENGTH = 8
ALIAS_RE = re.compile(r"^[a-zA-Z0-9]{8}$")


def generate_alias():
    return "".join(secrets.choice(ALIAS_ALPHABET) for _ in range(ALIAS_LENGTH))

r = redis.Redis(
    host=os.environ.get("REDIS_HOST", "redis"),
    port=int(os.environ.get("REDIS_PORT", 6379)),
    decode_responses=True,
)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/secrets", methods=["POST"])
def create_secret():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body required"}), 400

    ciphertext = data.get("ciphertext")
    ttl_hours = data.get("ttl_hours", 24)

    if not ciphertext or not isinstance(ciphertext, str):
        return jsonify({"error": "ciphertext is required and must be a string"}), 400

    if len(ciphertext) > MAX_CIPHERTEXT_SIZE:
        return jsonify({"error": "Payload too large (max 100KB)"}), 413

    try:
        base64.b64decode(ciphertext)
    except Exception:
        return jsonify({"error": "ciphertext must be valid base64"}), 400

    try:
        ttl_hours = int(ttl_hours)
    except (ValueError, TypeError):
        return jsonify({"error": "ttl_hours must be an integer"}), 400

    ttl_hours = max(1, min(72, ttl_hours))

    # Allow client to provide a pre-generated UUID (needed for HKDF key derivation).
    # If not provided, generate one server-side for backwards compatibility.
    secret_id = data.get("id")
    if secret_id:
        try:
            uuid.UUID(secret_id)
        except ValueError:
            return jsonify({"error": "id must be a valid UUID"}), 400
        # Prevent overwriting an existing secret
        if r.exists(f"secret:{secret_id}"):
            return jsonify({"error": "Secret ID already exists"}), 409
    else:
        secret_id = str(uuid.uuid4())

    ttl_seconds = ttl_hours * 3600
    r.setex(f"secret:{secret_id}", ttl_seconds, ciphertext)

    # Generate short alias for cleaner URLs
    alias = None
    for _ in range(5):
        candidate = generate_alias()
        if r.set(f"alias:{candidate}", secret_id, ex=ttl_seconds, nx=True):
            alias = candidate
            break

    return jsonify({"id": secret_id, "alias": alias}), 201


@app.route("/api/secrets/<secret_id>")
def get_secret(secret_id):
    actual_id = None
    alias_used = None

    # Try UUID first (backward compat)
    try:
        uuid.UUID(secret_id)
        actual_id = secret_id
    except ValueError:
        # Try alias lookup
        if not ALIAS_RE.match(secret_id):
            return jsonify({"error": "Invalid secret ID"}), 400
        actual_id = r.get(f"alias:{secret_id}")
        if actual_id is None:
            return jsonify({"error": "Secret not found or already viewed"}), 404
        alias_used = secret_id

    ciphertext = r.getdel(f"secret:{actual_id}")

    if ciphertext is None:
        return jsonify({"error": "Secret not found or already viewed"}), 404

    # Clean up alias
    if alias_used:
        r.delete(f"alias:{alias_used}")

    return jsonify({"ciphertext": ciphertext, "id": actual_id})


def main():
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
