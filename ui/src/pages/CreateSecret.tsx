import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Clock,
  Copy,
  Check,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import { generateKey, exportKey, encrypt } from "../lib/crypto";
import { createSecret } from "../lib/api";
import posthog from "../lib/posthog";

const TTL_OPTIONS = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
];

export default function CreateSecret() {
  const { t, i18n } = useTranslation();
  const [secret, setSecret] = useState("");
  const [ttlHours, setTtlHours] = useState(24);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) return;

    setLoading(true);
    setError("");
    setLink("");

    try {
      const id = crypto.randomUUID();
      const key = await generateKey();
      const ciphertext = await encrypt(secret, key, id);
      const result = await createSecret(ciphertext, ttlHours, id);
      const keyStr = await exportKey(key);
      const pathId = result.alias ?? result.id;
      setLink(`${window.location.origin}/s/${pathId}?lng=${i18n.language}#${keyStr}`);
      posthog.capture("secret_created", { ttl_hours: ttlHours });
      setSecret("");
    } catch (err) {
      posthog.capture("secret_create_failed");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(link);
    posthog.capture("secret_link_copied");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setLink("");
    setCopied(false);
  }

  function whatsappUrl() {
    const text = t("create.whatsappMsg", { link });
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  function mailtoUrl() {
    const subject = t("create.emailSubject");
    const body = t("create.emailBody", { link });
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <div className="hero">
        <h1 className="hero-title">{t("hero.title")}</h1>
        <p className="hero-subtitle">{t("hero.subtitle")}</p>
      </div>

      <div className="card">
        {!link ? (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="secret-input">
                <Lock size={14} />
                {t("create.label")}
              </label>
              <textarea
                id="secret-input"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={t("create.placeholder")}
                rows={6}
                maxLength={50000}
                required
              />
              <span className="char-count">
                {secret.length.toLocaleString()} / 50,000
              </span>
            </div>

            <div className="ttl-group">
              <span className="form-label">
                <Clock size={14} />
                {t("create.expiresIn")}
              </span>
              <div className="ttl-options" role="group" aria-label={t("create.expiresIn")}>
                {TTL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="ttl-option"
                    aria-pressed={ttlHours === opt.value}
                    onClick={() => setTtlHours(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-msg">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading || !secret.trim()}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  {t("create.encrypting")}
                </>
              ) : (
                <>
                  <Lock size={16} />
                  {t("create.submit")}
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="result">
            <div className="result-header">
              <CheckCircle2 size={18} />
              <span>{t("create.linkCreated")}</span>
            </div>

            <p className="result-info">{t("create.linkInfo")}</p>

            <div className="link-box">
              <div className="link-display">{link}</div>
            </div>

            <div className="share-label">{t("create.shareVia")}</div>
            <div className="share-buttons">
              <button
                className={`share-btn ${copied ? "share-btn--copied" : ""}`}
                onClick={handleCopy}
                aria-label={t("create.copy")}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
                <span>{copied ? t("create.copied") : t("create.copy")}</span>
              </button>

              <a
                className="share-btn share-btn--whatsapp"
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("create.whatsapp")}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>{t("create.whatsapp")}</span>
              </a>

              <a
                className="share-btn share-btn--email"
                href={mailtoUrl()}
                aria-label={t("create.email")}
              >
                <Mail size={17} />
                <span>{t("create.email")}</span>
              </a>
            </div>

            <button className="btn btn-secondary btn-full" onClick={handleReset}>
              <Plus size={16} />
              {t("create.createAnother")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
