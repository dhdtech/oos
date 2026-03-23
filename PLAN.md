# Implementation Plan: PDF Sharing Support for Only Once Share

## Executive Summary

This document outlines a comprehensive plan to add secure PDF sharing functionality to Only Once Share (ooshare.io). The existing architecture already supports image sharing with the same encryption model, making PDF support a natural extension.

**Key insight**: The current codebase already handles binary file attachments (images) up to 10MB through client-side AES-256-GCM encryption. Adding PDF support requires:
1. Extending accepted file types in the UI
2. Updating content/copy across the site
3. Adding PDF preview/download functionality
4. Minor backend validation updates

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Backend Changes (API)](#backend-changes-api)
3. [Frontend Changes (UI)](#frontend-changes-ui)
4. [Content Updates](#content-updates)
5. [Testing Plan](#testing-plan)
6. [Implementation Phases](#implementation-phases)
7. [Rollback Strategy](#rollback-strategy)

---

## Current Architecture Analysis

### How File Sharing Currently Works

```
┌─────────────────────────────────────────────────────────────────────┐
│ BROWSER (Client-Side)                                               │
├─────────────────────────────────────────────────────────────────────┤
│ 1. User enters text + drops file (image)                            │
│ 2. Generate AES-256 master key                                      │
│ 3. Derive per-secret key via HKDF-SHA-256(masterKey, secretId)      │
│ 4. Pack payload: [type][text_len][text][mime_len][mime][file_bytes] │
│ 5. Encrypt payload with AES-256-GCM (random IV, secretId as AAD)    │
│ 6. Send base64(ciphertext) to server                                │
│ 7. Receive secretId/alias, create link with key in URL fragment     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ SERVER (Zero-Knowledge)                                             │
├─────────────────────────────────────────────────────────────────────┤
│ - Receives and stores base64 ciphertext (max 15MB)                  │
│ - Cannot decrypt (no key)                                           │
│ - Cannot distinguish text from image from PDF                       │
│ - Stores with TTL in Redis                                          │
│ - Atomic GETDEL on retrieval                                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Files

| Component | File | Purpose |
|-----------|------|---------|
| API | `api/app.py` | Flask backend, Redis storage |
| Crypto | `ui/src/lib/crypto.ts` | AES-256-GCM encryption, payload encoding |
| Create UI | `ui/src/pages/CreateSecret.tsx` | File upload, form handling |
| View UI | `ui/src/pages/ViewSecret.tsx` | Decryption, file display |
| Translations | `ui/src/i18n/locales/*.json` | UI text in 6 languages |
| Blog | `ui/src/content/blog-posts.ts` | Blog content (20+ posts) |

### Current Supported File Types

```typescript
// CreateSecret.tsx line ~52
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
```

---

## Backend Changes (API)

### Current State

The backend is **already file-agnostic**. It handles base64-encoded ciphertext without inspecting content. No backend changes are strictly required for PDF support.

### Recommended Enhancements

#### 1. Update Size Limit Comment (Documentation Only)
**File**: `api/app.py`
**Line**: ~31

```python
# Current
MAX_CIPHERTEXT_SIZE = 15 * 1024 * 1024  # 15MB (supports 10MB images after base64 expansion)

# Updated
MAX_CIPHERTEXT_SIZE = 15 * 1024 * 1024  # 15MB (supports ~10MB files after base64 expansion)
```

#### 2. Add Analytics Event Property (Optional)
**File**: `api/app.py`

The current PostHog events track `has_image`. Consider extending to track file types generically:

```python
# Current (line ~92)
if posthog:
    posthog.capture("server", "secret_created", {"ttl_hours": ttl_hours, "has_alias": alias is not None})

# Optional enhancement: Add has_attachment flag
# Note: Server can't know file type (zero-knowledge), but client can send this
```

**Recommendation**: Keep the server zero-knowledge. Track file types client-side only in PostHog events.

#### 3. Health Check Enhancement (Optional)
**File**: `api/app.py`

Add supported features to health check for monitoring:

```python
@app.route("/api/health")
def health():
    log.info("Health check requested")
    return jsonify({
        "status": "ok",
        "version": "2.0.0",  # Bump version for PDF support
        "features": ["text", "image", "pdf"]
    })
```

### Size Considerations

| File Type | Raw Size | Base64 Size | Fits in 15MB limit? |
|-----------|----------|-------------|---------------------|
| PDF | 10MB | ~13.3MB | ✅ Yes |
| PDF | 11MB | ~14.7MB | ✅ Yes (tight) |
| PDF | 12MB | ~16MB | ❌ No |

**Recommendation**: Keep 10MB client-side limit. This provides headroom for base64 expansion + encryption overhead.

---

## Frontend Changes (UI)

### 1. Update Accepted File Types

**File**: `ui/src/pages/CreateSecret.tsx`

```typescript
// BEFORE (line ~52)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// AFTER
const ACCEPTED_TYPES = [
  // Images
  "image/jpeg",
  "image/png", 
  "image/gif",
  "image/webp",
  // PDF
  "application/pdf"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
```

### 2. Update File Input Accept Attribute

**File**: `ui/src/pages/CreateSecret.tsx`

```tsx
// BEFORE (line ~136)
<input
  ref={fileInputRef}
  type="file"
  accept="image/jpeg,image/png,image/gif,image/webp"
  onChange={handleFileInput}
  style={{ display: "none" }}
/>

// AFTER
<input
  ref={fileInputRef}
  type="file"
  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
  onChange={handleFileInput}
  style={{ display: "none" }}
/>
```

### 3. Update Preview Logic

**File**: `ui/src/pages/CreateSecret.tsx`

The current preview assumes images. Add conditional rendering for PDFs:

```tsx
// Add helper to detect file type
function isPdf(file: File | null): boolean {
  return file?.type === "application/pdf";
}

// Update preview section (around line 140-165)
{imageFile && imagePreview ? (
  <div className="file-preview">
    {isPdf(imageFile) ? (
      // PDF preview
      <div className="file-preview-pdf">
        <FileText size={32} />
        <div className="file-preview-info">
          <div className="file-preview-name">{imageFile.name}</div>
          <div className="file-preview-size">{formatFileSize(imageFile.size)}</div>
        </div>
      </div>
    ) : (
      // Image preview (existing)
      <img
        src={imagePreview}
        alt={t("create.file.preview")}
        className="image-preview-thumb"
      />
    )}
    {/* ... remove button ... */}
  </div>
) : (
  /* dropzone content */
)}
```

### 4. Update Variable Names for Clarity

**File**: `ui/src/pages/CreateSecret.tsx`

Rename image-specific variables to generic file terms:

```typescript
// BEFORE
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string>("");
const [imageError, setImageError] = useState("");

// AFTER
const [attachedFile, setAttachedFile] = useState<File | null>(null);
const [filePreview, setFilePreview] = useState<string>("");
const [fileError, setFileError] = useState("");
```

### 5. Update ViewSecret for PDF Display

**File**: `ui/src/pages/ViewSecret.tsx`

Add PDF download/view functionality:

```tsx
// Add state for PDF
const [pdfUrl, setPdfUrl] = useState("");
const [isPdfFile, setIsPdfFile] = useState(false);

// In the decryption logic (around line 35)
if (decoded.image) {
  const blob = new Blob([decoded.image.data as BlobPart], { type: decoded.image.mime });
  const url = URL.createObjectURL(blob);
  
  if (decoded.image.mime === "application/pdf") {
    setPdfUrl(url);
    setIsPdfFile(true);
  } else {
    setImageUrl(url);
    setIsPdfFile(false);
  }
}

// Add PDF display section in the revealed card
{pdfUrl && (
  <div className="secret-pdf-container">
    <div className="pdf-preview">
      <FileText size={48} />
      <p>{t("view.pdfAttached")}</p>
    </div>
    <div className="pdf-actions">
      <a
        href={pdfUrl}
        download="secret.pdf"
        className="btn btn-secondary"
      >
        <Download size={16} />
        {t("view.downloadPdf")}
      </a>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary"
      >
        <ExternalLink size={16} />
        {t("view.viewPdf")}
      </a>
    </div>
  </div>
)}
```

### 6. Add PDF-Specific Styles

**File**: `ui/src/styles/` (or inline styles)

```css
.secret-pdf-container {
  margin-top: 1rem;
  padding: 1.5rem;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  text-align: center;
}

.pdf-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.pdf-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
}

.file-preview-pdf {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}
```

### 7. Update PostHog Analytics

**File**: `ui/src/pages/CreateSecret.tsx`

```typescript
// BEFORE (line ~109)
posthog.capture("secret_created", { ttl_hours: ttlHours, has_image: !!imageFile });

// AFTER
posthog.capture("secret_created", { 
  ttl_hours: ttlHours, 
  has_attachment: !!attachedFile,
  attachment_type: attachedFile ? (isPdf(attachedFile) ? "pdf" : "image") : null
});
```

### 8. Add Lucide Icons Import

**File**: `ui/src/pages/CreateSecret.tsx` and `ui/src/pages/ViewSecret.tsx`

```typescript
import { FileText, Download, ExternalLink } from "lucide-react";
```

---

## Content Updates

This is the most extensive part of the implementation. All user-facing text must be updated to reflect PDF support.

### Translation Files to Update

| File | Language | Status |
|------|----------|--------|
| `ui/src/i18n/locales/en.json` | English | Primary |
| `ui/src/i18n/locales/zh.json` | Chinese | Translate from EN |
| `ui/src/i18n/locales/es.json` | Spanish | Translate from EN |
| `ui/src/i18n/locales/hi.json` | Hindi | Translate from EN |
| `ui/src/i18n/locales/ar.json` | Arabic | Translate from EN |
| `ui/src/i18n/locales/pt.json` | Portuguese | Translate from EN |

### Key Strings to Update (English)

#### Meta/SEO

```json
{
  "meta": {
    "title": "Only Once Share — Secure One-Time Secret, Image & PDF Sharing",
    "description": "Send passwords, images, PDFs, API keys, and sensitive documents securely with one-time self-destructing links. End-to-end AES-256 encryption, zero-knowledge architecture. Free and open source — no account required."
  }
}
```

#### Hero Section

```json
{
  "hero": {
    "title": "Share secrets securely",
    "subtitle": "End-to-end encrypted in your browser. Share text, images, and PDFs. The server never sees your data. Links self-destruct after one view."
  }
}
```

#### Create Form

```json
{
  "create": {
    "dropzone.label": "Drag & drop a file here",
    "dropzone.hint": "or click to browse",
    "dropzone.sizeLimit": "Max 10 MB · Images (JPEG, PNG, GIF, WebP) or PDF",
    "dropzone.dragActive": "Drop your file here",
    "file.invalidType": "Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed",
    "file.tooLarge": "File must be under 10 MB",
    "file.remove": "Remove file",
    "file.preview": "File preview"
  }
}
```

#### View Secret

```json
{
  "view": {
    "pdfAttached": "A PDF file is attached to this secret",
    "downloadPdf": "Download PDF",
    "viewPdf": "Open in new tab"
  }
}
```

#### FAQ Updates

Update these FAQ items to mention PDF support:

```json
{
  "pages.faq.q1": "How does Only Once Share work?",
  "pages.faq.a1": "When you create a secret — whether it's text, an image, a PDF, or a combination — your browser generates a random AES-256-GCM encryption key...",
  
  "pages.faq.q7": "Is Only Once Share free?",
  "pages.faq.a7": "Yes, completely free with no limits. Unlike some competitors that restrict free users to a handful of secrets per month or impose size caps, Only Once Share has no artificial limitations. You can share text secrets up to 50,000 characters and attach images or PDFs up to 10 MB (JPEG, PNG, GIF, WebP, PDF), with no account required...",
  
  "pages.faq.q8": "Do I need to create an account?",
  "pages.faq.a8": "No. Only Once Share requires no registration, no email, no account. Just enter your text, optionally attach an image or PDF, choose an expiration time, and share the generated link..."
}
```

#### Security Page

```json
{
  "pages.security.lead": "Only Once Share uses end-to-end AES-256-GCM encryption with a zero-knowledge architecture. Your text, images, and PDFs are encrypted in your browser before they ever leave your device — our server never sees your plaintext data.",
  
  "pages.security.e2eContent": "When you create a secret, your browser generates a random cryptographic key using the Web Crypto API. Your text and any attached files (images or PDFs) are packed into a single encrypted payload using <strong>AES-256-GCM</strong>...",
  
  "pages.security.serverContent": "Unlike some competing tools that perform encryption on the server (meaning the server briefly sees your plaintext data), Only Once Share encrypts <strong>entirely in the browser</strong>. The server never receives: your plaintext text, images, or PDFs, the encryption key, or any information that could be used to decrypt your data. It cannot even distinguish whether a secret contains text, an image, a PDF, or any combination."
}
```

#### About Page

```json
{
  "pages.about.missionP1": "Every day, millions of people share passwords, API keys, documents, and credentials through email, Slack, and text messages — channels that store data indefinitely and are vulnerable to breaches. We believe secure secret sharing should be free, simple, and truly private.",
  
  "pages.about.feature2Title": "Free & Unlimited",
  "pages.about.feature2Desc": "No artificial limits. No \"8 secrets per month.\" Share text up to 50,000 characters and files (images or PDFs) up to 10 MB, completely free, with no account required."
}
```

#### Why OOShare Page

```json
{
  "pages.why.metaTitle": "Why Only Once Share? — Secure Secret, Image & PDF Sharing Compared",
  "pages.why.metaDesc": "Compare Only Once Share vs OneTimeSecret, Privnote, Scrt.link, and Password.link. The only tool with encrypted image and PDF sharing, true zero-knowledge, and no limits — free and open source.",
  
  "pages.why.lead": "The only secret sharing tool with encrypted image and PDF support, truly zero-knowledge architecture, and no limits — completely free and open source.",
  
  "pages.why.benefit2Title": "Text, Image & PDF Sharing",
  "pages.why.benefit2Desc": "Share passwords, API keys, screenshots, documents, and sensitive PDFs in one encrypted link. No other secret sharing tool offers encrypted file support.",
  
  "pages.why.imageSharing": "Encrypted file sharing (images + PDF)",
  
  "pages.why.detail2Title": "Encrypted File Sharing — A First",
  "pages.why.detail2Desc": "No other secret sharing tool supports encrypted image and PDF sharing. With Only Once Share, you can securely share screenshots, photos of documents, signed contracts, sensitive diagrams, and any file up to 10 MB. Files and text are packed into a single encrypted payload — the server cannot even tell what type of content a secret contains."
}
```

### index.html Updates

**File**: `ui/index.html`

```html
<!-- Meta description -->
<meta name="description" content="Share passwords, images, PDFs, and secrets securely with one-time self-destructing links. End-to-end encrypted, zero-knowledge. Send sensitive data, API keys, documents, and credentials safely. Free, no account required." />

<!-- Open Graph -->
<meta property="og:title" content="Only Once Share — Secure One-Time Secret, Image & PDF Sharing" />
<meta property="og:description" content="Send passwords, images, PDFs, API keys, and sensitive documents securely with one-time self-destructing links. End-to-end AES-256 encryption, zero-knowledge architecture. Free and open source — no account required." />

<!-- Twitter Card -->
<meta name="twitter:title" content="Only Once Share — Secure One-Time Secret, Image & PDF Sharing" />
<meta name="twitter:description" content="Send passwords, images, PDFs, API keys, and sensitive documents securely with one-time self-destructing links. End-to-end AES-256 encryption, zero-knowledge architecture. Free and open source — no account required." />

<!-- Keywords -->
<meta name="keywords" content="secret sharing, one-time secret, share password securely, secure password sharing, send password, one-time link, self-destructing link, self-destructing message, encrypted sharing, zero-knowledge, sensitive information, end-to-end encryption, AES-256 encryption, share API keys, send credentials securely, temporary password sharing, private sharing, secure text sharing, self-destructing notes, share secrets online free, no account required, encrypted credentials, one-time URL, password sender, share image securely, encrypted image sharing, self-destructing image, share screenshot securely, private image sharing, one-time image share, secure photo sharing, send private photos, encrypted photo link, share sensitive images, share pdf securely, encrypted pdf sharing, self-destructing pdf, secure document sharing, one-time pdf share, send pdf securely, encrypted document link, share sensitive documents" />
```

### Blog Post Updates

**File**: `ui/src/content/blog-posts.ts`

Several blog posts mention that the tool doesn't support files or only supports images. These need updates:

#### Posts to Update

1. **"5 Best Free One-Time Secret Sharing Tools in 2025"** (`best-free-secret-sharing-tools`)
   - Update comparison table: Change "File sharing: No" to "File sharing: Yes (images + PDF)"
   - Update OOShare description to mention PDF support

2. **"The Complete Guide to One-Time Secret Sharing"** (`complete-guide-one-time-secret-sharing`)
   - Update "Not Ideal For" section (currently says "Files — Most text-based secret sharing tools don't support file uploads")
   - OOShare now supports files, so update this

3. **"Why You Should Share Images Securely"** (`why-share-images-securely`)
   - Consider adding PDF to this article or creating a companion article
   - Update to mention that OOShare now supports both images and PDFs

4. **"How Only Once Share Implements Zero-Knowledge"** (various posts)
   - Update references from "text and images" to "text, images, and PDFs"

5. **Comparison tables** in multiple posts
   - Update "Image sharing: Yes" rows to "File sharing: Yes (images + PDF)"

### Footer Badges (Optional)

Consider adding a "PDF Support" badge alongside existing ones:
- AES-256-GCM
- Zero Knowledge
- Auto-Delete
- **Files Supported** (new)
- Open Source

---

## Testing Plan

### Unit Tests

#### Crypto Module Tests
**File**: `ui/src/lib/crypto.test.ts`

```typescript
describe("PDF payload encoding", () => {
  it("should encode and decode PDF payload correctly", async () => {
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF magic bytes
    const payload = encodePayload("Test message", {
      mime: "application/pdf",
      data: pdfBytes,
    });
    
    const decoded = decodePayload(payload);
    
    expect(decoded.text).toBe("Test message");
    expect(decoded.image?.mime).toBe("application/pdf");
    expect(decoded.image?.data).toEqual(pdfBytes);
  });

  it("should handle large PDF files up to 10MB", async () => {
    const largePdf = new Uint8Array(10 * 1024 * 1024); // 10MB
    const payload = encodePayload("", { mime: "application/pdf", data: largePdf });
    
    expect(payload.length).toBeLessThan(15 * 1024 * 1024);
  });
});
```

#### CreateSecret Tests
**File**: `ui/src/pages/CreateSecret.test.tsx`

```typescript
describe("PDF file handling", () => {
  it("should accept PDF files", async () => {
    render(<CreateSecret />);
    
    const file = new File(["dummy pdf content"], "test.pdf", {
      type: "application/pdf",
    });
    
    const input = screen.getByRole("button", { name: /drag.*drop/i });
    await userEvent.upload(input, file);
    
    expect(screen.getByText("test.pdf")).toBeInTheDocument();
  });

  it("should reject files over 10MB", async () => {
    render(<CreateSecret />);
    
    const largeFile = new File(
      [new ArrayBuffer(11 * 1024 * 1024)],
      "large.pdf",
      { type: "application/pdf" }
    );
    
    const input = screen.getByRole("button", { name: /drag.*drop/i });
    await userEvent.upload(input, largeFile);
    
    expect(screen.getByText(/must be under 10 MB/i)).toBeInTheDocument();
  });

  it("should reject non-allowed file types", async () => {
    render(<CreateSecret />);
    
    const file = new File(["content"], "test.exe", {
      type: "application/x-msdownload",
    });
    
    const input = screen.getByRole("button", { name: /drag.*drop/i });
    await userEvent.upload(input, file);
    
    expect(screen.getByText(/only images.*and PDFs/i)).toBeInTheDocument();
  });
});
```

#### ViewSecret Tests
**File**: `ui/src/pages/ViewSecret.test.tsx`

```typescript
describe("PDF display", () => {
  it("should show download and view buttons for PDF secrets", async () => {
    // Mock API response with PDF payload
    vi.mocked(getSecret).mockResolvedValueOnce({
      ciphertext: mockPdfCiphertext,
      id: "test-id",
    });
    
    render(<ViewSecret />, { route: "/s/abc123#validkey" });
    
    await waitFor(() => {
      expect(screen.getByText(/pdf file is attached/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /download pdf/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /open in new tab/i })).toBeInTheDocument();
    });
  });
});
```

### Integration Tests

#### API Tests
**File**: `api/test_app.py`

```python
def test_create_secret_with_large_payload():
    """Test that large payloads (simulating encrypted PDFs) are accepted."""
    # ~10MB of base64 data
    large_ciphertext = base64.b64encode(b"x" * (10 * 1024 * 1024)).decode()
    
    response = client.post("/api/secrets", json={
        "ciphertext": large_ciphertext,
        "ttl_hours": 1,
        "id": str(uuid.uuid4()),
    })
    
    assert response.status_code == 201

def test_reject_oversized_payload():
    """Test that payloads over 15MB are rejected."""
    oversized = base64.b64encode(b"x" * (16 * 1024 * 1024)).decode()
    
    response = client.post("/api/secrets", json={
        "ciphertext": oversized,
        "ttl_hours": 1,
    })
    
    assert response.status_code == 413
```

### E2E Tests

Create end-to-end tests with Playwright or Cypress:

```typescript
// e2e/pdf-sharing.spec.ts
import { test, expect } from "@playwright/test";

test("complete PDF sharing flow", async ({ page }) => {
  // 1. Create secret with PDF
  await page.goto("/");
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles("fixtures/test.pdf");
  
  await expect(page.getByText("test.pdf")).toBeVisible();
  
  await page.getByRole("button", { name: /create secret/i }).click();
  
  // 2. Get the generated link
  await expect(page.getByText(/secret link created/i)).toBeVisible();
  const link = await page.locator(".link-display").textContent();
  
  // 3. Open link in new context (simulates recipient)
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  await page2.goto(link!);
  
  // 4. Verify PDF is displayed
  await expect(page2.getByText(/pdf file is attached/i)).toBeVisible();
  await expect(page2.getByRole("link", { name: /download pdf/i })).toBeVisible();
  
  // 5. Verify second access fails
  await page.goto(link!);
  await expect(page.getByText(/not available/i)).toBeVisible();
});
```

### Manual Testing Checklist

- [ ] Upload PDF via drag-and-drop
- [ ] Upload PDF via file picker
- [ ] Verify PDF preview shows filename and size
- [ ] Verify file type validation rejects .exe, .zip, etc.
- [ ] Verify 10MB size limit is enforced
- [ ] Create secret with text + PDF
- [ ] Create secret with PDF only
- [ ] View secret with PDF - verify download works
- [ ] View secret with PDF - verify "Open in new tab" works
- [ ] Verify one-time viewing (second access returns 404)
- [ ] Test all 6 languages for updated strings
- [ ] Test mobile responsiveness of PDF preview/download UI
- [ ] Verify analytics events include attachment_type

---

## Implementation Phases

### Phase 1: Core PDF Support (2-3 days)

**Goal**: Get PDF upload and download working

1. Update `ACCEPTED_TYPES` and file input accept attribute
2. Add PDF detection helper function
3. Update CreateSecret preview to show PDF icon instead of image
4. Add PDF display section to ViewSecret
5. Add download/view buttons for PDFs
6. Update variable names (imageFile → attachedFile)
7. Add basic CSS for PDF preview

**Deliverables**:
- PDF upload works
- PDF download/view works
- Existing image functionality unaffected

### Phase 2: Content Updates - English (1-2 days)

**Goal**: Update all English copy

1. Update `en.json` with new/modified strings
2. Update `index.html` meta tags and keywords
3. Update blog posts that mention file support
4. Review and update Security, About, Why, FAQ pages

**Deliverables**:
- All English content reflects PDF support
- SEO metadata updated

### Phase 3: Content Updates - Translations (2-3 days)

**Goal**: Update all non-English locales

1. Update `zh.json` (Chinese)
2. Update `es.json` (Spanish)
3. Update `hi.json` (Hindi)
4. Update `ar.json` (Arabic)
5. Update `pt.json` (Portuguese)
6. Update blog translations in `ui/src/content/blog/*.ts`

**Deliverables**:
- All 6 languages have updated copy
- Blog translations updated where applicable

### Phase 4: Testing & Polish (1-2 days)

**Goal**: Ensure quality and stability

1. Write/update unit tests
2. Write integration tests
3. Perform manual testing
4. Fix any bugs discovered
5. Performance testing with large PDFs
6. Accessibility review

**Deliverables**:
- All tests passing
- No regressions in existing functionality

### Phase 5: Documentation & Release (1 day)

**Goal**: Ship it

1. Update README.md
2. Update CLAUDE.md if needed
3. Create changelog entry
4. Deploy to staging
5. Final QA
6. Deploy to production
7. Announce (optional: blog post about new feature)

---

## Rollback Strategy

### If Issues Are Discovered Post-Deploy

1. **Immediate**: Revert the frontend changes (accepted file types)
   - This prevents new PDF uploads while allowing existing secrets to work
   
2. **Short-term**: If backend issues, revert API changes (unlikely needed)

3. **Content**: Content changes are independent and don't affect functionality
   - Can be reverted separately if copy issues discovered

### Feature Flag Option (Alternative)

If you prefer a gradual rollout, implement a feature flag:

```typescript
// config.ts
export const FEATURES = {
  PDF_SUPPORT: import.meta.env.VITE_ENABLE_PDF === "true",
};

// CreateSecret.tsx
const ACCEPTED_TYPES = FEATURES.PDF_SUPPORT
  ? ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]
  : ["image/jpeg", "image/png", "image/gif", "image/webp"];
```

This allows enabling PDF support per-environment during testing.

---

## Summary

Adding PDF support to Only Once Share is a relatively straightforward enhancement because the existing architecture already handles binary file attachments. The main work is:

1. **UI changes**: Accept PDF file type, show appropriate preview/download UI
2. **Content updates**: Update ~100+ strings across 6 languages to mention PDF support
3. **Testing**: Ensure PDF encryption/decryption works correctly, no regressions

**Estimated total effort**: 7-11 days

**Risk level**: Low - the core encryption/storage layer is unchanged

**Key files to modify**:
- `ui/src/pages/CreateSecret.tsx` (file handling)
- `ui/src/pages/ViewSecret.tsx` (PDF display)
- `ui/src/i18n/locales/*.json` (6 files)
- `ui/src/content/blog-posts.ts` (blog content)
- `ui/index.html` (SEO)
