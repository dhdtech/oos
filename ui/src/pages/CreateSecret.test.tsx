import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import CreateSecret from "./CreateSecret";

vi.mock("../lib/crypto", () => ({
  generateKey: vi.fn().mockResolvedValue("mock-key"),
  exportKey: vi.fn().mockResolvedValue("mock-exported-key"),
  encrypt: vi.fn().mockResolvedValue("mock-ciphertext"),
}));

vi.mock("../lib/api", () => ({
  createSecret: vi
    .fn()
    .mockResolvedValue({ id: "mock-uuid", alias: "AbCd1234" }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CreateSecret", () => {
  it("renders the form", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText("Share secrets securely")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste your password/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Create Secret Link")).toBeInTheDocument();
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    const textarea = screen.getByPlaceholderText(/paste your password/i);
    await user.type(textarea, "hello");
    expect(screen.getByText("5 / 50,000")).toBeInTheDocument();
  });

  it("renders all TTL options", () => {
    renderWithProviders(<CreateSecret />);
    for (const label of ["1h", "4h", "12h", "24h", "48h", "72h"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("24h TTL is selected by default", () => {
    renderWithProviders(<CreateSecret />);
    const btn = screen.getByText("24h");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("changes TTL selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.click(screen.getByText("1h"));
    expect(screen.getByText("1h")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("24h")).toHaveAttribute("aria-pressed", "false");
  });

  it("submit is disabled when textarea is empty", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText("Create Secret Link").closest("button")).toBeDisabled();
  });

  it("submits and shows link result", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "my secret",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Secret link created")).toBeInTheDocument();
    });

    // Link should use alias
    expect(screen.getByText(/AbCd1234/)).toBeInTheDocument();
  });

  it("shows share buttons after creation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Copy")).toBeInTheDocument();
      expect(screen.getByText("WhatsApp")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  it("whatsapp link has correct href", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      const link = screen.getByLabelText("WhatsApp");
      expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
    });
  });

  it("email link has correct href", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      const link = screen.getByLabelText("Email");
      expect(link).toHaveAttribute("href", expect.stringContaining("mailto:"));
    });
  });

  it("copy button copies link to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => screen.getByText("Copy"));
    await user.click(screen.getByLabelText("Copy"));

    expect(writeText).toHaveBeenCalled();
    expect(screen.getByText("Copied")).toBeInTheDocument();
  });

  it("create another resets to form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => screen.getByText("Create Another"));
    await user.click(screen.getByText("Create Another"));

    expect(
      screen.getByPlaceholderText(/paste your password/i),
    ).toBeInTheDocument();
  });

  it("shows error on API failure", async () => {
    const { createSecret } = await import("../lib/api");
    vi.mocked(createSecret).mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("shows generic error for non-Error throws", async () => {
    const { encrypt } = await import("../lib/crypto");
    vi.mocked(encrypt).mockRejectedValueOnce("string error");

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
