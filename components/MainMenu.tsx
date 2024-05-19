import CreateIcon from "@mui/icons-material/Create";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Box, Button, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState, ReactElement, FC } from "react";

import { sarMenus } from "@/helpers/constants";

interface MainMenuProps {
  sx?: SxProps<Theme>;
}

interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string | ReactElement;
  subMenus?: { id: string; title: string }[];
}

const MainMenuItem: FC<MainMenuItemProps> = ({ id, title, icon, subMenus }): ReactElement => {
  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (typeof icon === "string" && icon === "create") icon = <CreateIcon data-testid="testid.icon.create" />;
  if (typeof icon === "string" && icon === "reviews") icon = <ReviewsIcon data-testid="testid.icon.reviews" />;
  if (typeof icon === "string" && icon === "myReviews") icon = <ListAltIcon data-testid="testid.icon.myReviews" />;

  return (
    <>
      <Button
        key={id}
        onClick={handleClick}
        onMouseOver={handleClick}
        sx={{ my: 2, color: "white" }}
        endIcon={icon}
        data-testid={`testid.mainMenu.${id}`}
      >
        {t(title)}
      </Button>
      {subMenus && subMenus.length > 0 && (
        <Menu
          id={id}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            onMouseLeave: handleClose,
          }}
        >
          {subMenus.map((subPage) => (
            <MenuItem key={subPage.id} onClick={handleClose} data-testid={`testid.reviewsMenu.${subPage.id}`}>
              {t(subPage.title)}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

const MainMenu: FC<MainMenuProps> = ({ sx }): ReactElement => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-evenly", flexGrow: 1, ...sx }}>
      {sarMenus.map((page) => (
        <MainMenuItem key={page.id} {...page} />
      ))}
    </Box>
  );
};

export default MainMenu;
