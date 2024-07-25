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
  it.each(["en", "fr"])("renders a LanguageSwitcher - %s", async (lang) => {
    (useTranslation as jest.Mock).mockReturnValue({ lang });
    render(<LanguageSwitcher />);

    const langSwitcher = screen.getByTestId("testid.menu.languageSwitcher");
    expect(langSwitcher).toBeInTheDocument();
    expect(langSwitcher).toHaveTextContent(lang === "en" ? "FR" : "EN");

    await userEvent.click(langSwitcher);
    expect(window.location.href).toEqual(`http://example.com/${lang === "en" ? "fr" : "en"}/`);
    expect(document.cookie).toEqual(`NEXT_LOCALE=${lang === "en" ? "fr" : "en"}`);
  });
});
