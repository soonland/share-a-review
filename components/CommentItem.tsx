// CommentItem.jsx
import { Grid, Typography, useTheme } from "@mui/material";

const CommentItem = ({ comment }) => {
  const theme = useTheme();

  return (
    <Grid
      item
      sx={{
        paddingLeft: theme.spacing(2),
        borderLeft: `2px solid ${theme.palette.grey[300]}`,
        marginBottom: 1,
      }}
    >
      <Typography variant="body2">
        <b>{comment.user_name}</b>: {comment.content}
      </Typography>
    </Grid>
  );
};

export default CommentItem;
