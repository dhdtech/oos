import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PostHogProvider } from "posthog-js/react";
import posthog from "./lib/posthog";
import Layout from "./components/Layout";
import CreateSecret from "./pages/CreateSecret";
import ViewSecret from "./pages/ViewSecret";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CreateSecret />} />
            <Route path="/s/:id" element={<ViewSecret />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>
);
