// ProfileCard.jsx
import { Avatar, Stack, Typography, useTheme } from "@mui/material";

const ProfileCard = ({ user }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
      }}
      direction="row"
      spacing={1}
      alignItems="center"
    >
      <Avatar alt={user.review_user_name} src={user.review_user_avatar} />
      <Typography variant="subtitle2">{user.review_user_name}</Typography>
    </Stack>
  );
};

export default ProfileCard;
