import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Stack, Typography, IconButton, useTheme, darken } from "@mui/material";
import Rating from "@mui/material/Rating";
import Link from "next/link";

import CommentsSection from "./CommentsSection";

/**
 * A component that displays a detailed review including the item name, category,
 * rating, date, content, likes, and comments section.
 *
 * @param {Object} props - The component props
 * @param {Object} props.review - The review object
 * @param {string} props.review.id - Unique identifier for the review
 * @param {string} props.review.item_name - Name of the reviewed item
 * @param {string} props.review.item_category_slug - URL slug for the item category
 * @param {string} props.review.item_category_name - Display name of the item category
 * @param {number} props.review.review_rating - Rating value (0-5)
 * @param {string} props.review.review_date_created - Creation date of the review
 * @param {string} props.review.review_content - Main content of the review
 * @param {number} props.review.review_likes - Number of helpful votes
 * @param {Array} props.review.comments - Array of comments on the review
 * @returns {JSX.Element} A styled stack containing the review details and comments
 */
const Review = ({ review }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        backgroundColor: darken(theme.palette.background.paper, 0.05),
      }}
      data-testid={`testid.reviews.reviewItem.${review.id}.review`}
    >
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body1">
          {review.item_name} -{" "}
          <Link
            href={{
              pathname: `/categories/${review.item_category_slug}`,
            }}
          >
            <Typography variant="overline">{review.item_category_name}</Typography>
          </Link>
        </Typography>
        <Rating name="read-only" value={review.review_rating} readOnly />
      </Stack>
      <Typography variant="caption" sx={{ fontStyle: "italic" }}>
        On {new Date(review.review_date_created).toLocaleString()}
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
    </Stack>
  );
};

export default Review;
