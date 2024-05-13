import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useTranslation from "next-translate/useTranslation";

import LanguageSwitcher from "../LanguageSwitcher";

jest.mock("next-translate/useTranslation");

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock("next/navigation", () => ({
      usePathname: jest.fn(() => "/"),
    }));
  });
  it("renders a LanguageSwitcher - EN -> FR", async () => {
    (useTranslation as jest.Mock).mockReturnValue({ lang: "en" });
    Object.defineProperty(window, "location", {
      value: new URL("http://example.com"),
      configurable: true,
    });
    render(<LanguageSwitcher />);

    const langSwitcher = screen.getByTestId("testid.menu.languageSwitcher");
    expect(langSwitcher).toBeInTheDocument();
    expect(langSwitcher).toHaveTextContent("FR");

    await userEvent.click(langSwitcher);
    expect(window.location.href).toEqual("http://example.com/fr/");
  });

  it("renders a LanguageSwitcher - FR -> EN", async () => {
    (useTranslation as jest.Mock).mockReturnValue({ lang: "fr" });
    Object.defineProperty(window, "location", {
      value: new URL("http://example.com"),
      configurable: true,
    });
    render(<LanguageSwitcher />);

    const langSwitcher = screen.getByTestId("testid.menu.languageSwitcher");
    expect(langSwitcher).toBeInTheDocument();
    expect(langSwitcher).toHaveTextContent("EN");

    await userEvent.click(langSwitcher);
    expect(window.location.href).toEqual("http://example.com/en/");
  });
});
