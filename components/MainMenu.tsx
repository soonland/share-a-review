import { Box, SxProps, Theme } from "@mui/material";
import { ReactElement, FC } from "react";

import { sarMenus } from "@/helpers/constants";

import MainMenuItem from "./MainMenuItem";

interface MainMenuProps {
  sx?: SxProps<Theme>;
}

const MainMenu: FC<MainMenuProps> = ({ sx }): ReactElement => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-evenly", flexGrow: 1, ...sx }}
      data-testid="testid.mainMenu.container"
    >
      {sarMenus.map((page) => (
        <MainMenuItem key={page.id} {...page} />
      ))}
    </Box>
  );
};

export default MainMenu;
