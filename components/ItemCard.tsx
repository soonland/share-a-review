import { Box, Card, CardContent, Rating, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const ItemCard = ({ item }) => {
  const {
    item_name,
    item_slug,
    item_category_name,
    item_category_slug,
    recent_review_rating,
    recent_review_content,
    recent_review_likes,
    recent_review_dislikes,
    recent_review_date_created,
  } = item;
  console.log("item", item);
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          <Link href={`/items/${item_slug}`} color="inherit">
            {item_name}
          </Link>
        </Typography>
        <Typography color="textSecondary" className="category-name">
          <Link href={`/reviews/${item_category_slug}`} color="inherit">
            {item_category_name}
          </Link>
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Written {formatDistanceToNow(new Date(recent_review_date_created), { addSuffix: true })}
        </Typography>
        <Box mt={2}>
          <Rating value={recent_review_rating} size="small" readOnly />
          <Typography variant="body2" className="review-content">
            {recent_review_content}
          </Typography>
          <Typography variant="body2" className="review-meta">
            Likes: {recent_review_likes} | Dislikes: {recent_review_dislikes} |
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
