import CreateIcon from "@mui/icons-material/Create";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Button, CircularProgress, Menu, MenuItem } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState, ReactElement, FC } from "react";
import useSWR from "swr";

interface MainMenuItemProps {
  id: string;
  title: string;
  icon?: string | ReactElement;
  subMenus?: { id: string; title: string }[];
}

const MainMenuItem: FC<MainMenuItemProps> = ({ id, title, icon, subMenus }): ReactElement => {
  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = () => {
    console.log("clicked");
  };

  const handleMouseOver = (event) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let iconElement;
  if (typeof icon === "string" && icon === "create") iconElement = <CreateIcon data-testid="testid.icon.create" />;
  if (typeof icon === "string" && icon === "reviews") iconElement = <ReviewsIcon data-testid="testid.icon.reviews" />;
  if (typeof icon === "string" && icon === "myReviews")
    iconElement = <ListAltIcon data-testid="testid.icon.myReviews" />;

  const fetcher = async (url: string) => {
    const queryUrl = `${url}`;
    const res = await fetch(`${queryUrl}`);
    return await res.json();
  };

  const { data } = useSWR(`/api/reviews`, fetcher);

  if (!data) return <CircularProgress />;

  return (
    <>
      <Button
        key={id}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        sx={{ my: 2, color: "white" }}
        endIcon={iconElement}
        data-testid={`testid.mainMenu.${id}`}
      >
        {t(title) + (icon === "reviews" ? ` (${data?.data?.length ?? 0})` : "")}
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

export default MainMenuItem;
