import { AccountCircle, Logout, ManageAccounts } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState, MouseEvent, ReactElement, FC } from "react";

import LanguageSwitcher from "./LanguageSwitcher";

interface UserMenuProps {
  sx?: SxProps<Theme>;
}

const UserMenu: FC<UserMenuProps> = ({ sx }): ReactElement => {
  const session = useSession();
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
    <Box sx={sx}>
      <IconButton edge="end" onClick={handleClick} data-testid="testid.menu.accountButton" sx={{ ml: 1 }}>
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
        <MenuItem onClick={openMyAccount} data-testid="testid.menu.account">
          {t("userMenu.account")}
          <ManageAccounts fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
        <MenuItem onClick={openMyProfile} data-testid="testid.menu.profile">
          {t("userMenu.profile")}
          <AccountCircle fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
        <LanguageSwitcher />
        {session.status === "authenticated" ? (
          <MenuItem onClick={() => signOut()} data-testid="testid.menu.signOut">
            {t("userMenu.signOut")}
            <Logout fontSize="small" sx={{ mr: 1 }} />
          </MenuItem>
        ) : (
          <MenuItem onClick={() => signIn()} data-testid="testid.menu.signIn">
            {t("userMenu.signIn")}
            <Logout fontSize="small" sx={{ mr: 1 }} />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default UserMenu;
