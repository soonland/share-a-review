import { Grid, Rating, Stack, Typography, darken, useTheme } from "@mui/material";
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
    <Grid container flexDirection="column" spacing={2}>
      {reviews.map((review) => (
        <Grid
          item
          key={review.review_id}
          sx={{
            marginBottom: theme.spacing(2),
            padding: theme.spacing(2),
            borderRadius: theme.spacing(2),
            "&:nth-child(even)": {
              backgroundColor: darken(theme.palette.background.paper, 0.1),
            },
            "&:nth-child(odd)": {
              backgroundColor: darken(theme.palette.background.paper, 0.05),
            },
          }}
        >
          <Stack
            sx={{
              marginBottom: theme.spacing(2),
            }}
          >
            <Typography component="span" variant="overline">
              {review.item_category_name}
            </Typography>
            <Typography variant="h3">{review.item_name} </Typography>
            <Typography variant="h4">
              Review by {review.review_user_name} -{" "}
              <span>{new Date(review.review_date_created).toLocaleDateString()}</span>
            </Typography>
            <Typography>{review.review_content}</Typography>
            <Typography component="legend">Rating</Typography>
            <Rating name="simple-controlled" value={review.review_rating} readOnly />
            <Typography>Likes {review.review_likes}</Typography>
          </Stack>
          <Grid container direction="column" spacing={1}>
            {review.comments.map((comment) => (
              <Grid
                item
                key={comment.id}
                sx={{
                  paddingLeft: theme.spacing(5),
                  borderLeft: `2px solid ${theme.palette.grey[300]}`,
                  marginBottom: 1,
                  marginLeft: theme.spacing(2),
                }}
              >
                <Typography variant="body1">
                  <b>{comment.user_name}</b>: {comment.content}
                </Typography>
                <Typography variant="body2">
                  Likes: {comment.likes} | Dislikes: {comment.dislikes}
                </Typography>
              </Grid>
            ))}
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
