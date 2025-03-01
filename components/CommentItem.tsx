import { Grid, Typography, useTheme } from "@mui/material";

/**
 * A component that renders an individual comment with author name and content.
 * Displays with a left border and padding for visual hierarchy.
 *
 * @param {Object} props - The component props
 * @param {Object} props.comment - The comment object
 * @param {string} props.comment.id - Unique identifier for the comment
 * @param {string} props.comment.user_name - Name of the comment author
 * @param {string} props.comment.content - The comment text content
 * @returns {JSX.Element} A grid item containing the formatted comment with author name and content
 */
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
