import { MoreVert as MoreVertIcon, SvgIconComponent } from "@mui/icons-material";
import { Box, Button, Badge, styled, IconButton } from "@mui/material";

import { Notification } from "@/models/types";

const StyledButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  width: "100%",
  "&.collapsed": {
    minWidth: 48,
    padding: theme.spacing(0, 1),
  },
  "&:not(.collapsed)": {
    minWidth: "auto",
    padding: theme.spacing(0, 2),
  },
}));

const ButtonContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const BadgeContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});

interface SidebarButtonProps {
  icon: SvgIconComponent;
  label: string;
  isSelected: boolean;
  isCollapsed: boolean;
  unreadCount?: number;
  onClick: () => void;
  onOptionsClick?: (event: React.MouseEvent<HTMLElement>) => void;
  showOptions?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isSelected,
  isCollapsed,
  unreadCount = 0,
  onClick,
  onOptionsClick,
  showOptions,
}: SidebarButtonProps) => {
  return (
    <Box position="relative">
      <StyledButton
        variant={isSelected ? "contained" : "text"}
        fullWidth
        className={isCollapsed ? "collapsed" : ""}
        onClick={onClick}
      >
        <ButtonContent>
          <Icon sx={{ mr: isCollapsed ? 0 : 1 }} />
          {!isCollapsed && (
            <BadgeContainer>
              <span>{label}</span>
              {unreadCount > 0 && <Badge color="error" badgeContent={unreadCount} />}
            </BadgeContainer>
          )}
        </ButtonContent>
        {showOptions && onOptionsClick && (
          <IconButton
            size="small"
            sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
            onClick={onOptionsClick}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </StyledButton>
    </Box>
  );
};

export const getUnreadCount = (notifications: Notification[], folder: string, type?: string) => {
  return notifications.filter(
    (n) => n.status === "unread" && n.folder.toLowerCase() === folder.toLowerCase() && (!type || n.type === type),
  ).length;
};
