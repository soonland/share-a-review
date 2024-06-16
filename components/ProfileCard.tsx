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
      data-testid={`testid.reviews.reviewItem.${user.id}.profileCard`}
    >
      <Avatar
        data-testid={`testid.reviews.reviewItem.${user.id}.profileCard.avatar`}
        alt={user.review_user_name}
        src={user.review_user_avatar}
      />
      <Typography variant="subtitle2" data-testid={`testid.reviews.reviewItem.${user.id}.profileCard.name`}>
        {user.review_user_name}
      </Typography>
    </Stack>
  );
};

export default ProfileCard;
