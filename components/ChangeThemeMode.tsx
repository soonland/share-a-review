import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import IconButton from "@mui/material/IconButton";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";

import { IThemeContext, ThemeContext } from "./context/ThemeProvider";

const ChangeThemeMode = () => {
  const { t } = useTranslation("common");
  const { dark, isDark } = useContext<IThemeContext>(ThemeContext);

  return (
    <IconButton
      edge="end"
      onClick={() => dark(isDark === "dark" ? "light" : "dark")}
      data-testid="testid.changeThemeMode"
      sx={{ ml: 1 }}
      title={t("menu.changeThemeMode")}
    >
      {isDark === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ChangeThemeMode;
