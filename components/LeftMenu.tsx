import CreateIcon from "@mui/icons-material/Create";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Drawer, List, ListItem, SxProps, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";

import { sarMenus } from "@/helpers/constants";

interface LeftMenuProps {
  sx?: SxProps<Theme>;
}

const LeftMenu: FC<LeftMenuProps> = ({ sx }): ReactElement => {
  const { t } = useTranslation("common");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const convertToIcons = (icon: string) => {
    if (icon === "create") {
      return <CreateIcon />;
    }
    if (icon === "reviews") {
      return <ReviewsIcon />;
    }
    if (icon === "myReviews") {
      return <ListAltIcon />;
    }
  };
  return (
    <>
      <IconButton
        key={"menuButton"}
        sx={{ ...sx }}
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setIsDrawerOpen(true)}
        data-testid="testid.mainMenu.reviews"
      >
        <ReviewsIcon />
      </IconButton>
      <Drawer
        key={"drawer"}
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data-testid="testid.drawer"
      >
        <List>
          {sarMenus.map((menu) => (
            <ListItem key={menu.id} onClick={() => setIsDrawerOpen(false)} data-testid={`testid.drawer.${menu.id}`}>
              <IconButton color="inherit" aria-label={t(menu.title)}>
                {convertToIcons(menu.icon as string)}
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default LeftMenu;
