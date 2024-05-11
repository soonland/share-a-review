import { AccountCircle, Logout, ManageAccounts } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { signOut } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState, MouseEvent } from "react";

import LanguageSwitcher from "./LanguageSwitcher";

const UserMenu = () => {
  const { t } = useTranslation("common");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openMyAccount = () => {
    return;
  };

  const openMyProfile = () => {
    return;
  };

  return (
    <>
      <IconButton edge="end" onClick={handleClick} data-testid="testid.accountButton" sx={{ ml: 1 }}>
        <AccountCircle htmlColor="white" />
      </IconButton>
      <Menu
        id="user-menu"
        data-testid="testid.userMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "user-menu",
        }}
        sx={{
          "& .MuiMenuItem-root": { justifyContent: "space-between" },
          "& .MuiSvgIcon-root": { marginLeft: 1 },
        }}
      >
        <MenuItem onClick={openMyAccount} data-testid="testid.account">
          {t("common.account")}
          <ManageAccounts fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
        <MenuItem onClick={openMyProfile} data-testid="testid.profile">
          {t("common.profile")}
          <AccountCircle fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
        <LanguageSwitcher />
        <MenuItem onClick={() => signOut()} data-testid="testid.logout">
          {t("common.signOut")}
          <Logout fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
