import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex");
    return () => {
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="content-page">
      <div className="card">
        <div className="not-found-card">
          <h1>404 — Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="back-link">
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
