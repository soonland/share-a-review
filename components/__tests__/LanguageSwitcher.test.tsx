import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useTranslation from "next-translate/useTranslation";

import LanguageSwitcher from "../LanguageSwitcher";

jest.mock("next-translate/useTranslation");

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    asPath: "/",
  }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: new URL("http://example.com"),
      configurable: true,
    });
  });
  it("renders a LanguageSwitcher - EN -> FR", async () => {
    (useTranslation as jest.Mock).mockReturnValue({ lang: "en" });
    render(<LanguageSwitcher />);

    const langSwitcher = screen.getByTestId("testid.menu.languageSwitcher");
    expect(langSwitcher).toBeInTheDocument();
    expect(langSwitcher).toHaveTextContent("FR");

    await userEvent.click(langSwitcher);
    expect(window.location.href).toEqual("http://example.com/fr/");
    expect(document.cookie).toEqual("NEXT_LOCALE=fr");
  });

  it("renders a LanguageSwitcher - FR -> EN", async () => {
    (useTranslation as jest.Mock).mockReturnValue({ lang: "fr" });

    render(<LanguageSwitcher />);

    const langSwitcher = screen.getByTestId("testid.menu.languageSwitcher");
    expect(langSwitcher).toBeInTheDocument();
    expect(langSwitcher).toHaveTextContent("EN");

    await userEvent.click(langSwitcher);
    expect(window.location.href).toEqual("http://example.com/en/");

    expect(document.cookie).toEqual("NEXT_LOCALE=en");
  });
});
