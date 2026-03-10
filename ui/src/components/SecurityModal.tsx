import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  HelpCircle,
  X,
  Shield,
  Lock,
  Eye,
  Trash2,
  Server,
  Hash,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

export default function SecurityModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="info-trigger"
        onClick={() => setOpen(true)}
        aria-label={t("security.title")}
      >
        <HelpCircle size={18} />
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("security.title")}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-left">
                <Shield size={18} />
                <h2>{t("security.title")}</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="security-item">
                <div className="security-item-icon"><Lock size={16} /></div>
                <div>
                  <h3>{t("security.e2eTitle")}</h3>
                  <p>{t("security.e2eDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><KeyRound size={16} /></div>
                <div>
                  <h3>{t("security.hkdfTitle")}</h3>
                  <p>{t("security.hkdfDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><ShieldCheck size={16} /></div>
                <div>
                  <h3>{t("security.aadTitle")}</h3>
                  <p>{t("security.aadDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><Eye size={16} /></div>
                <div>
                  <h3>{t("security.zkTitle")}</h3>
                  <p>{t("security.zkDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><Hash size={16} /></div>
                <div>
                  <h3>{t("security.keyTitle")}</h3>
                  <p>{t("security.keyDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><Trash2 size={16} /></div>
                <div>
                  <h3>{t("security.oneTimeTitle")}</h3>
                  <p>{t("security.oneTimeDesc")}</p>
                </div>
              </div>
              <div className="security-item">
                <div className="security-item-icon"><Server size={16} /></div>
                <div>
                  <h3>{t("security.expiryTitle")}</h3>
                  <p>{t("security.expiryDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
