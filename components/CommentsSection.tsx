import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import CommentItem from "./CommentItem";

/**
 * A collapsible section that displays a list of comments for a review.
 * Renders an expandable accordion with comment count in the header.
 *
 * @param {Object} props - The component props
 * @param {Array} [props.comments] - Array of comment objects. Optional - if not provided or empty, displays a message to be first to comment
 * @param {string} props.comments[].id - Unique identifier for each comment
 * @param {Object} props.comments[].comment - The comment data to be passed to CommentItem
 * @returns {JSX.Element} An accordion component containing the list of comments or empty state message
 */
const CommentsSection = ({ comments }) => {
  return (
    <Accordion disableGutters sx={{}}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2">Comments ({comments?.length ?? 0})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={1}>
          {comments?.length > 0 ? (
            comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <Typography variant="body2">No comments! Be the first to comment. 🦄</Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default CommentsSection;
