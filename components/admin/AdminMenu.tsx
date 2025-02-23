import { Settings as SettingsIcon } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, SxProps, Theme } from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useState, MouseEvent, ReactElement, FC } from "react";

interface AdminMenuProps {
  sx?: SxProps<Theme>;
}

const AdminMenu: FC<AdminMenuProps> = ({ sx }): ReactElement | null => {
  const session = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isAdmin = session.data?.user?.is_admin;
  const open = Boolean(anchorEl);

  if (!isAdmin) return null;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToSection = (section: string) => {
    handleClose();
    router.push(`/admin?section=${section}`);
  };

  return (
    <Box sx={sx}>
      <IconButton edge="end" onClick={handleClick} data-testid="testid.adminMenu.button" sx={{ ml: 1 }}>
        <SettingsIcon />
      </IconButton>
      <Menu
        id="admin-menu"
        data-testid="testid.adminMenu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "admin-menu",
        }}
        sx={{
          "& .MuiMenuItem-root": { justifyContent: "space-between" },
        }}
      >
        <MenuItem onClick={() => navigateToSection("users")} data-testid="testid.adminMenu.users">
          {t("adminMenu.users")}
          <SettingsIcon fontSize="small" />
        </MenuItem>
        <MenuItem onClick={() => navigateToSection("categories")} data-testid="testid.adminMenu.categories">
          {t("adminMenu.categories")}
          <SettingsIcon fontSize="small" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminMenu;
