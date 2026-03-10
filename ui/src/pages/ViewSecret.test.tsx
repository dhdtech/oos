import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import ViewSecret from "./ViewSecret";
import * as api from "../lib/api";
import * as cryptoLib from "../lib/crypto";

// Mock react-router-dom's useParams
const mockUseParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => mockUseParams() };
});

vi.mock("../lib/api");
vi.mock("../lib/crypto");

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "test-alias" });

  vi.mocked(cryptoLib.importKey).mockResolvedValue("mock-key" as unknown as CryptoKey);
  vi.mocked(cryptoLib.decrypt).mockResolvedValue("decrypted secret");

  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...window.location, hash: "#mock-key-string" },
  });
});

describe("ViewSecret", () => {
  it("shows loading state initially", () => {
    vi.mocked(api.getSecret).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ViewSecret />);
    expect(
      screen.getByText("Retrieving and decrypting secret..."),
    ).toBeInTheDocument();
  });

  it("shows decrypted secret on success", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "encrypted",
      id: "real-uuid",
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("decrypted secret")).toBeInTheDocument();
    });
    expect(screen.getByText(/permanently destroyed/i)).toBeInTheDocument();
  });

  it("shows not-found when secret already viewed", async () => {
    vi.mocked(api.getSecret).mockRejectedValue(
      new Error("Secret not found or already viewed"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Secret Not Available")).toBeInTheDocument();
    });
  });

  it("shows error state on decrypt failure", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });
    vi.mocked(cryptoLib.decrypt).mockRejectedValue(
      new Error("Decryption failed"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
      expect(screen.getByText("Decryption failed")).toBeInTheDocument();
    });
  });

  it("shows error for non-Error exceptions", async () => {
    vi.mocked(api.getSecret).mockRejectedValue("string error");

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("shows error when hash is missing", async () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, hash: "" },
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("shows error when id is missing", async () => {
    mockUseParams.mockReturnValue({ id: undefined });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("copy button copies decrypted secret", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });

    const user = userEvent.setup();
    renderWithProviders(<ViewSecret />);

    await waitFor(() => screen.getByText("decrypted secret"));
    await user.click(screen.getByLabelText("Copy secret"));

    expect(writeText).toHaveBeenCalledWith("decrypted secret");
    expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("shows 'Share a new secret' link when revealed", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Share a new secret")).toBeInTheDocument();
    });
  });

  it("shows 'Back to home' link on error", async () => {
    vi.mocked(api.getSecret).mockRejectedValue(
      new Error("Secret not found"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Back to home")).toBeInTheDocument();
    });
  });
});
