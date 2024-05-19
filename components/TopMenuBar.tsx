import ReviewsIcon from "@mui/icons-material/Reviews";
import { useMediaQuery, useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement } from "react";

import ChangeThemeMode from "./ChangeThemeMode";
import LeftMenu from "./LeftMenu";
import MainMenu from "./MainMenu";
import UserMenu from "./UserMenu";

const TopMenuBar: FC = (): ReactElement => {
  const { t } = useTranslation("common");

  const theme = useTheme();
  const isExtraSmallSize = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      data-testid="testid.appBar"
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.secondary,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          // minHeight: { xs: 64 },
          padding: { xs: 0 },
        }}
      >
        <Toolbar sx={{ display: "flex", width: "100%" }}>
          {isExtraSmallSize && <LeftMenu sx={{ display: "flex" }} />}
          {!isExtraSmallSize && <ReviewsIcon data-testid="testid.menuButton" sx={{ marginRight: 1 }} />}
          <Typography variant="h6" component="div">
            {t("appName")}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{!isExtraSmallSize && <MainMenu />}</Box>
          <ChangeThemeMode sx={{ display: { xs: "none", md: "flex" } }} />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopMenuBar;
