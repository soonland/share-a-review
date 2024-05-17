import { Create } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState, ReactElement, FC } from "react";

interface TopMenuProps {
  sx?: SxProps<Theme>;
}

interface TopMenuItemProps {
  id: string;
  title: string;
  icon?: ReactElement;
  subMenus?: { id: string; title: string }[];
  handleOpen: (anchorEl: HTMLElement | null) => void;
  open: boolean;
}

const TopMenuItem: FC<TopMenuItemProps> = ({ id, title, icon, subMenus }): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button key={id} onClick={handleClick} onMouseOver={handleClick} sx={{ my: 2, color: "white" }} endIcon={icon}>
        {title}
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
            <MenuItem key={subPage.id} onClick={handleClose}>
              {subPage.title}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

const TopMenu: FC<TopMenuProps> = (): ReactElement => {
  const { t } = useTranslation("common");
  const [anchorElOpened, setAnchorElOpened] = useState<{ id: string; open: boolean }[]>([]);

  const handleOpen = (id: string) => {
    console.log("id", id);
    const newAnchorElOpened = anchorElOpened.map((anchorEl) => {
      if (anchorEl.id === id) {
        return { id, open: !anchorEl.open };
      } else {
        return { id: anchorEl.id, open: false };
      }
    });
    setAnchorElOpened(newAnchorElOpened);
  };

  const reviewMenus = [
    { id: "allReviews", title: t("topMenu.reviewsMenu.allReviews") },
    { id: "movies", title: t("topMenu.reviewsMenu.movies") },
    { id: "books", title: t("topMenu.reviewsMenu.books") },
    { id: "music", title: t("topMenu.reviewsMenu.music") },
    { id: "games", title: t("topMenu.reviewsMenu.games") },
    { id: "products", title: t("topMenu.reviewsMenu.products") },
    { id: "places", title: t("topMenu.reviewsMenu.places") },
    { id: "restaurants", title: t("topMenu.reviewsMenu.restaurants") },
    { id: "recipes", title: t("topMenu.reviewsMenu.recipes") },
    { id: "videos", title: t("topMenu.reviewsMenu.videos") },
    { id: "apps", title: t("topMenu.reviewsMenu.apps") },
    { id: "services", title: t("topMenu.reviewsMenu.services") },
    { id: "events", title: t("topMenu.reviewsMenu.events") },
    { id: "other", title: t("topMenu.reviewsMenu.other") },
  ];

  const sarMenus = [
    { id: "reviews", title: t("topMenu.reviews"), subMenus: reviewMenus },
    { id: "myReviews", title: t("topMenu.myReviews") },
    { id: "writeReview", title: t("topMenu.writeReview"), icon: <Create /> },
  ];

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "space-evenly" }}>
      {sarMenus.map((page) => (
        <TopMenuItem
          key={page.id}
          {...page}
          handleOpen={(anchorEl) => handleOpen(anchorEl ? page.id : "")}
          open={anchorElOpened.find((anchorEl) => anchorEl.id === page.id)?.open || false}
        />
      ))}
    </Box>
  );
};

export default TopMenu;
