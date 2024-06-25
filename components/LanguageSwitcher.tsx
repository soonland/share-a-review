import { Language } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { FC, useEffect } from "react";

const LanguageSwitcher: FC = () => {
  const { asPath: location } = useRouter();
  const { lang } = useTranslation();

  const switchTo = lang === "en" ? "fr" : "en";

  function persistLocaleCookie() {
    const date = new Date();
    const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
    date.setTime(date.getTime() + expireMs);
    document.cookie = `NEXT_LOCALE=${switchTo};expires=${date.toUTCString()};path=/`;
  }

  const handleLanguageSwitch = () => {
    const url = new URL(location, window.location.origin);
    const parts = url.pathname.split("/");
    parts.splice(1, 0, switchTo);
    url.pathname = parts.join("/");
    persistLocaleCookie();
    window.location.href = url.toString();
  };

  useEffect(persistLocaleCookie, [switchTo]);

  return (
    <MenuItem onClick={handleLanguageSwitch} data-testid="testid.menu.languageSwitcher">
      {switchTo.toUpperCase()}
      <Language fontSize="small" sx={{ mr: 1 }} />
    </MenuItem>
  );
};

export default LanguageSwitcher;
