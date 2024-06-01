import { Grid, Rating, Typography } from "@mui/material";
import useSWR from "swr";

import Alert from "@/components/Alert";

const Reviews = () => {
  const fetcher = async (url: string) => {
    const res = await fetch(`${url}`);
    return await res.json();
  };

  const { data, isLoading, error } = useSWR("/api/reviews", fetcher);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews</div>;
  if (data?.message) return <Alert severity="error" message={data.message} />;
  if (data?.data?.length == 0) return <div>No reviews found</div>;

  return (
    <Grid container flexDirection={"column"} spacing={2}>
      {data.data.map((review) => (
        <Grid item key={review.id}>
          <h3>{review.review_type}</h3>
          <h4>
            {review.name} - <span>{review.date_created}</span>
          </h4>
          <p>{review.content}</p>
          <Typography component="legend">Rating</Typography>
          <Rating name="simple-controlled" value={review.rating} readOnly />
          <p>Likes {review.likes}</p>
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
