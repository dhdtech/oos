import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShieldOff,
  ArrowLeft,
  EyeOff,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { importKey, decrypt } from "../lib/crypto";
import { getSecret } from "../lib/api";
import posthog from "../lib/posthog";

type Status = "loading" | "revealed" | "not-found" | "error";

export default function ViewSecret() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchAndDecrypt() {
      const keyStr = window.location.hash.slice(1);
      if (!keyStr || !id) {
        setError(t("view.invalidLink"));
        setStatus("error");
        return;
      }

      try {
        const result = await getSecret(id);
        const key = await importKey(keyStr);
        const decrypted = await decrypt(result.ciphertext, key, result.id);
        setPlaintext(decrypted);
        posthog.capture("secret_viewed");
        setStatus("revealed");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to decrypt";
        if (msg.includes("not found") || msg.includes("already viewed")) {
          posthog.capture("secret_not_found");
          setStatus("not-found");
        } else {
          posthog.capture("secret_view_failed");
          setError(msg);
          setStatus("error");
        }
      }
    }

    fetchAndDecrypt();
  }, [id, t]);

  async function handleCopy() {
    await navigator.clipboard.writeText(plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="view-container">
      {status === "loading" && (
        <div className="card">
          <div className="loading-card">
            <div className="loading-spinner" />
            <p>{t("view.loading")}</p>
          </div>
        </div>
      )}

      {status === "revealed" && (
        <div className="card">
          <div className="revealed-card">
            <div className="destroyed-banner">
              <ShieldOff size={15} />
              <span>{t("view.destroyed")}</span>
            </div>
            <div className="secret-content">{plaintext}</div>
            <button
              className={`btn btn-sm btn-full ${copied ? "btn-success" : "btn-secondary"}`}
              onClick={handleCopy}
              aria-label={t("view.copySecret")}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? t("view.copiedClipboard") : t("view.copySecret")}
            </button>
          </div>
        </div>
      )}

      {status === "not-found" && (
        <div className="card">
          <div className="not-found-card">
            <div className="not-found-icon">
              <EyeOff size={22} />
            </div>
            <h2>{t("view.notFoundTitle")}</h2>
            <p>{t("view.notFoundMsg")}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="card">
          <div className="error-card">
            <div className="error-icon">
              <AlertCircle size={22} />
            </div>
            <h2>{t("view.errorTitle")}</h2>
            <p>{error || t("view.errorMsg")}</p>
          </div>
        </div>
      )}

      <a href="/" className="back-link">
        <ArrowLeft size={15} />
        {status === "revealed" ? t("view.newSecret") : t("view.backHome")}
      </a>
    </div>
  );
}
