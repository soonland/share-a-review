import { MoreVert as MoreVertIcon, SvgIconComponent } from "@mui/icons-material";
import { Box, Badge, styled, IconButton } from "@mui/material";

import { Notification } from "@/models/types";

const StyledContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  "& .options-button": {
    transition: "opacity 0.2s ease-in-out",
    opacity: 0,
    visibility: "hidden",
  },
  "&:hover .options-button, & .options-button.force-visible": {
    opacity: 1,
    visibility: "visible",
  },
  "& .clickable-area": {
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: theme.shape.borderRadius,
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    "&.collapsed": {
      minWidth: 48,
      padding: theme.spacing(0, 1),
    },
    "&:not(.collapsed)": {
      minWidth: "auto",
      padding: theme.spacing(0, 2),
    },
  },
}));

const ContentWrapper = styled(Box)({
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
    <StyledContainer>
      <Box
        component="div"
        role="button"
        tabIndex={0}
        className={`clickable-area ${isCollapsed ? "collapsed" : ""} ${isSelected ? "selected" : ""}`}
        onClick={onClick}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
      >
        <ContentWrapper>
          <Icon sx={{ mr: isCollapsed ? 0 : 1 }} />
          {!isCollapsed && (
            <BadgeContainer>
              <span>{label}</span>
              {unreadCount > 0 && <Badge color="error" badgeContent={unreadCount} />}
            </BadgeContainer>
          )}
        </ContentWrapper>
      </Box>
      {onOptionsClick && (
        <IconButton
          size="small"
          className={`options-button ${showOptions ? "force-visible" : ""}`}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: (theme) => theme.palette.background.paper,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent's onClick
            onOptionsClick(e);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      )}
    </StyledContainer>
  );
};

export const getUnreadCount = (notifications: Notification[], folder: string, type?: string) => {
  return notifications.filter(
    (n) => n.status === "unread" && n.folder.toLowerCase() === folder.toLowerCase() && (!type || n.type === type),
  ).length;
};
