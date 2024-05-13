import { Language } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import React, { FC } from "react";

const LanguageSwitcher: FC = () => {
  const location = usePathname() ?? "";
  const { lang } = useTranslation();

  const switchTo = lang === "en" ? "fr" : "en";

  const handleLanguageSwitch = () => {
    const url = new URL(location, window.location.origin);
    // split the pathname into parts
    const parts = url.pathname.split("/");
    // insert the new language code at the second position
    parts.splice(1, 0, switchTo);
    // join the parts back together
    url.pathname = parts.join("/");
    // redirect to the new URL
    window.location.href = url.toString();
  };

  return (
    <MenuItem onClick={handleLanguageSwitch} data-testid="testid.menu.languageSwitcher">
      {switchTo.toUpperCase()}
      <Language fontSize="small" sx={{ mr: 1 }} />
    </MenuItem>
  );
};

export default LanguageSwitcher;
