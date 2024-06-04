import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Grid,
  Rating,
  Stack,
  Typography,
  IconButton,
  darken,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import useSWR from "swr";

import Alert from "@/components/Alert";

const Reviews = () => {
  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${url}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await res.json();
  };

  const { data, isLoading, error } = useSWR("/api/reviews", fetcher);
  const theme = useTheme();

  if (!data) {
    return <Typography>Loading...</Typography>;
  }

  const { data: reviews, success } = data;
  if (!success) {
    return <Alert severity="error" message={data.message} />;
  }
  if (isLoading) return <div>Loading...</div>;
  if (data?.message) return <Alert severity="error" message={data.message} />;
  if (error) return <Alert severity="error" message={error.message || "An error occurred"} />;
  if (reviews?.length == 0) return <div>No reviews found</div>;

  return (
    <Grid container spacing={2}>
      {reviews.map((review) => (
        <Grid item container key={review.review_id} xs={12}>
          <Grid item xs={3}>
            <Stack
              sx={{
                padding: theme.spacing(1),
                borderRadius: theme.spacing(1),
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Avatar alt={review.review_user_name} src={review.review_user_avatar} />
              <Typography variant="subtitle2">{review.review_user_name}</Typography>
            </Stack>
          </Grid>
          <Grid
            item
            xs={9}
            sx={{
              padding: theme.spacing(1),
              borderRadius: theme.spacing(1),
              backgroundColor: darken(theme.palette.background.paper, 0.05),
            }}
          >
            <Stack direction="column" spacing={1}>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">{review.item_name}</Typography>
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
            </Stack>
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="comments-content" id="comments-header">
                <Typography variant="body2">Comments ({review.comments.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container direction="column" spacing={1}>
                  {review.comments.length > 0 ? (
                    review.comments.map((comment) => (
                      <Grid
                        item
                        key={comment.id}
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
                    ))
                  ) : (
                    <Typography variant="body2">No comment! Be the first to comment. 🦄</Typography>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Reviews;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
