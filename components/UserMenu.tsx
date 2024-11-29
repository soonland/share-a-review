import { AccountCircle, Logout, Notifications } from "@mui/icons-material";
import { Avatar, Badge, Box, IconButton, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState, MouseEvent, ReactElement, FC } from "react";
import useSWR from "swr";

import { fetcher } from "@/helpers/utils";

import LanguageSwitcher from "./LanguageSwitcher";

interface UserMenuProps {
  sx?: SxProps<Theme>;
}

const UserMenu: FC<UserMenuProps> = ({ sx }): ReactElement => {
  const session = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openMyProfile = () => {
    handleClose();
    return;
  };

  const goToNotifications = () => {
    handleClose();
    router.push("/notifications");
  };

  const { data } = useSWR(
    session.status === "authenticated" ? "/api/notifications/count" : null, // URL ou null si pas connecté
    fetcher,
  );

  return (
    <Box sx={sx}>
      <IconButton edge="end" onClick={handleClick} data-testid="testid.menu.accountButton" sx={{ ml: 1 }}>
        <Avatar
          src={session?.data?.user?.image}
          alt={session.data?.user?.name}
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          {session.data?.user?.name?.charAt(0)}
        </Avatar>
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
        <LanguageSwitcher />
        <MenuItem onClick={() => openMyProfile()} data-testid="testid.menu.profile">
          {t("userMenu.profile")}
          <AccountCircle fontSize="small" sx={{ mr: 1 }} />
        </MenuItem>
        {session.status === "authenticated" ? (
          [
            <MenuItem key="notifications" onClick={() => goToNotifications()} data-testid="testid.menu.notifications">
              {t("userMenu.notifications")}
              <Badge badgeContent={data?.count} color="primary">
                <Notifications fontSize="small" sx={{ mr: 1 }} />
              </Badge>
            </MenuItem>,
            <MenuItem key="signOut" onClick={() => signOut()} data-testid="testid.menu.signOut">
              {t("userMenu.signOut")}
              <Logout fontSize="small" sx={{ mr: 1 }} />
            </MenuItem>,
          ]
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
