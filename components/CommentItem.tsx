import { Grid, Typography, useTheme } from "@mui/material";

const CommentItem = ({ comment }) => {
  const theme = useTheme();

  return (
    <Grid
      data-testid={`testid.comment.${comment.id}`}
      item
      sx={{
        paddingLeft: theme.spacing(2),
        borderLeft: `2px solid ${theme.palette.grey[300]}`,
        marginBottom: 1,
      }}
    >
      <Typography variant="body2" data-testid={`testid.comment.content.${comment.id}`}>
        <Typography
          component="span"
          variant="body2"
          fontWeight="500"
          data-testid={`testid.comment.author.${comment.id}`}
        >
          {comment.user_name}
        </Typography>
        : {comment.content}
      </Typography>
    </Grid>
  );
};

export default CommentItem;
