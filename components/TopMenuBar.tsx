import ReviewsIcon from "@mui/icons-material/Reviews";
import { useTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement } from "react";

import ChangeThemeMode from "./ChangeThemeMode";
import Search from "./Search";
import UserMenu from "./UserMenu";

const TopMenuBar: FC = (): ReactElement => {
  const session = useSession();

  const { t } = useTranslation("common");

  const theme = useTheme();

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
        }}
      >
        <Toolbar sx={{ display: "flex", width: "100%" }}>
          <IconButton edge="start" color="inherit" aria-label="menu" data-testid="testid.menuButton">
            <ReviewsIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            {t("appName")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search />
          {session.status === "authenticated" && <UserMenu />}
          <ChangeThemeMode />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopMenuBar;
