import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import CommentItem from "./CommentItem";

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
