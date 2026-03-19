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
  X,
} from "lucide-react";
import { importKey, decrypt, decodePayload } from "../lib/crypto";
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
  const [imageUrl, setImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

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
        const decryptedBytes = await decrypt(result.ciphertext, key, result.id);
        const decoded = decodePayload(decryptedBytes);
        setPlaintext(decoded.text);
        if (decoded.image) {
          const blob = new Blob([decoded.image.data], { type: decoded.image.mime });
          setImageUrl(URL.createObjectURL(blob));
        }
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

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

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

            {plaintext && (
              <>
                <div className="secret-content">{plaintext}</div>
                <button
                  className={`btn btn-sm btn-full ${copied ? "btn-success" : "btn-secondary"}`}
                  onClick={handleCopy}
                  aria-label={t("view.copySecret")}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? t("view.copiedClipboard") : t("view.copySecret")}
                </button>
              </>
            )}

            {imageUrl && (
              <div className="secret-image-container">
                <img
                  src={imageUrl}
                  alt={t("view.clickToEnlarge")}
                  className="secret-image-thumb"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="secret-image-hint">{t("view.clickToEnlarge")}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {showImageModal && imageUrl && (
        <div
          className="image-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setShowImageModal(false)}
              aria-label={t("view.imageModal.close")}
            >
              <X size={16} />
            </button>
            <img src={imageUrl} alt={t("view.clickToEnlarge")} />
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
