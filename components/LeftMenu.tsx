import AppsIcon from "@mui/icons-material/Apps";
import BuildIcon from "@mui/icons-material/Build";
import EventIcon from "@mui/icons-material/Event";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MovieIcon from "@mui/icons-material/Movie";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlaceIcon from "@mui/icons-material/Place";
import RateReviewIcon from "@mui/icons-material/RateReview";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Drawer, List, ListItemIcon, ListItemText, MenuItem, SxProps, Theme, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement, useState } from "react";

import { sarMenus } from "@/helpers/constants";

interface LeftMenuProps {
  sx?: SxProps<Theme>;
}

const LeftMenuItem = styled(MenuItem)(() => ({
  width: "180px",
  margin: "0 10px",
}));
const LeftMenu: FC<LeftMenuProps> = ({ sx }): ReactElement => {
  const { t } = useTranslation("common");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const iconMap: { [key: string]: React.ReactNode } = {
    RateReview: <RateReviewIcon />,
    Movie: <MovieIcon />,
    MenuBook: <MenuBookIcon />,
    MusicNote: <MusicNoteIcon />,
    SportsEsports: <SportsEsportsIcon />,
    ShoppingCart: <ShoppingCartIcon />,
    Place: <PlaceIcon />,
    Restaurant: <RestaurantIcon />,
    RestaurantMenu: <RestaurantMenuIcon />,
    VideoLibrary: <VideoLibraryIcon />,
    Apps: <AppsIcon />,
    Build: <BuildIcon />,
    Event: <EventIcon />,
    MoreHoriz: <MoreHorizIcon />,
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
            <LeftMenuItem
              key={menu.id}
              onClick={() => setIsDrawerOpen(false)}
              data-testid={`testid.drawer.${menu.id}`}
              sx={{ px: 1, py: 1, cursor: "pointer" }}
            >
              <ListItemIcon color="inherit" aria-label={t(menu.title)} data-testid={`testid.drawer.${menu.id}.icon`}>
                {iconMap[menu.icon as string]}
                {menu.subMenus && (
                  <List>
                    {menu.subMenus.map((subMenu) => (
                      <LeftMenuItem
                        key={subMenu.id}
                        onClick={() => setIsDrawerOpen(false)}
                        data-testid={`testid.drawer.${subMenu.id}`}
                        sx={{ px: 1, py: 1, cursor: "pointer" }}
                      >
                        <ListItemIcon
                          color="inherit"
                          aria-label={t(subMenu.title)}
                          data-testid={`testid.drawer.${subMenu.id}.icon`}
                        >
                          {iconMap[subMenu.icon as string]}
                        </ListItemIcon>
                        <ListItemText>{t(subMenu.title)}</ListItemText>
                      </LeftMenuItem>
                    ))}
                  </List>
                )}
              </ListItemIcon>
              <ListItemText>{t(menu.title)}</ListItemText>
            </LeftMenuItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default LeftMenu;
