import { Grid, Typography } from "@mui/material";
import useSWR from "swr";

import Alert from "@/components/Alert";
import ReviewItem from "@/components/ReviewItem";

const Reviews = () => {
  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${url}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await res.json();
  };

  const { data, isLoading, error } = useSWR("/api/reviews", fetcher);

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

  console.log(reviews);
  return (
    <Grid container spacing={2}>
      {reviews.map((review) => (
        <ReviewItem key={review.review_id} review={review} />
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
