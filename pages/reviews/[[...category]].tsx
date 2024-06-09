import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";

import Alert from "@/components/Alert";
import ReviewItem from "@/components/ReviewItem";

const Reviews = () => {
  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    clearTimeout(timeoutId);
    return (
      fetch(`${url}`, { signal: controller.signal })
        // return fetch(`${url}`)
        .then((res) => {
          if (!res.ok) {
            return { success: false, message: "An error occurred while fetching the data." };
          }
          return res.json();
        })
        .catch((error) => {
          return { success: false, message: error.message };
        })
    );
  };

  const router = useRouter();
  const { category = "" } = router.query;
  const { data, isLoading, error } = useSWR(`/api/reviews/${category}`, fetcher);

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
