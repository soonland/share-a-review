// Review.jsx
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Stack, Typography, IconButton, Divider } from "@mui/material";
import Rating from "@mui/material/Rating";

import CommentsSection from "./CommentsSection";

const Review = ({ review }) => {
  return (
    <Stack direction="column" spacing={1}>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">
          {review.item_name} - <Typography variant="overline">{review.item_category_name}</Typography>
        </Typography>
        <Rating name="read-only" value={review.review_rating} readOnly />
      </Stack>
      <Typography variant="caption" sx={{ fontStyle: "italic" }}>
        Reviewed by {review.review_user_name} on {new Date(review.review_date_created).toLocaleDateString()}
      </Typography>
      <Typography variant="body2">{review.review_content}</Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          <Typography variant="caption">{review.review_likes} people found this helpful</Typography>
          <IconButton aria-label="add-like" size="small" color="primary">
            <ThumbUpIcon />
          </IconButton>
        </Stack>
      </Stack>
      <CommentsSection comments={review.comments} />
      <Divider />
    </Stack>
  );
};

export default Review;
