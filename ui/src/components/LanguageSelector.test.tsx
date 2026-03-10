import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector", () => {
  it("renders trigger button with flag", () => {
    renderWithProviders(<LanguageSelector />);
    expect(screen.getByLabelText("Select language")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);

    await user.click(screen.getByLabelText("Select language"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows all 6 languages", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    await user.click(screen.getByLabelText("Select language"));

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("中文")).toBeInTheDocument();
    expect(screen.getByText("Español")).toBeInTheDocument();
    expect(screen.getByText("हिन्दी")).toBeInTheDocument();
    expect(screen.getByText("العربية")).toBeInTheDocument();
    expect(screen.getByText("Português")).toBeInTheDocument();
  });

  it("closes dropdown when selecting a language", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);

    await user.click(screen.getByLabelText("Select language"));
    await user.click(screen.getByText("Español"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("toggles dropdown on repeated clicks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);

    const trigger = screen.getByLabelText("Select language");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown on outside click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <div>
        <LanguageSelector />
        <button>outside</button>
      </div>,
    );

    await user.click(screen.getByLabelText("Select language"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByText("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
