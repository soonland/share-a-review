import CreateIcon from "@mui/icons-material/Create";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Button, CircularProgress, Menu, MenuItem, useTheme } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { useState, ReactElement, FC } from "react";

import { MainMenuItemProps } from "@/helpers/constants";
import { useFetch } from "@/helpers/utils";

const MainMenuItem: FC<MainMenuItemProps> = ({ id, title, icon, subMenus, url }): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event) => {
    if (id === "writeReview") {
      router.push(new URL(url as string, window.location.origin).pathname);
    }
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

  const { data } = useFetch(`/api/reviews`);

  if (!data) return <CircularProgress />;

  return (
    <>
      <Button
        key={id}
        onClick={handleClick}
        sx={{ my: 2 }}
        endIcon={iconElement}
        data-testid={`testid.mainMenu.${id}`}
        variant="outlined"
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
            <Link
              key={subPage.url}
              href={{
                pathname: subPage.url,
              }}
              passHref
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                data-testid={`testid.${id}.${subPage.id}`}
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                {t(subPage.title)}
              </MenuItem>
            </Link>
          ))}
        </Menu>
      )}
    </>
  );
};

export default MainMenuItem;
