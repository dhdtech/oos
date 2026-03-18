import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="content-page">
      <div className="card">
        <div className="not-found-card">
          <h1>404 — Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <a href="/" className="back-link">
            <ArrowLeft size={15} />
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
