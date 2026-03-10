const API_BASE = import.meta.env.VITE_API_URL || "";

export interface CreateSecretResult {
  id: string;
  alias: string | null;
}

export async function createSecret(
  ciphertext: string,
  ttlHours: number,
  id: string,
): Promise<CreateSecretResult> {
  const res = await fetch(`${API_BASE}/api/secrets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ciphertext, ttl_hours: ttlHours, id }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create secret");
  }

  const data = await res.json();
  return { id: data.id, alias: data.alias ?? null };
}

export interface GetSecretResult {
  ciphertext: string;
  id: string;
}

export async function getSecret(id: string): Promise<GetSecretResult> {
  const res = await fetch(`${API_BASE}/api/secrets/${id}`);

  if (res.status === 404) {
    throw new Error("Secret not found or already viewed");
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to retrieve secret");
  }

  const data = await res.json();
  return { ciphertext: data.ciphertext, id: data.id };
}
