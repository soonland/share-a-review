/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid } from "@mui/material";
import { JSX, FC } from "react";

import Alert from "@/components/Alert";
import ReviewItem from "@/components/ReviewItem";
import SearchForm from "@/components/SearchForm";

interface ReviewsListProps {
  data: any;
  isLoading: boolean;
  error: any;
}

const ReviewsList: FC<ReviewsListProps> = ({ data, isLoading, error }) => {
  let banner: JSX.Element = <></>;
  if (isLoading) banner = <div>Loading...</div>;
  if (error) banner = <Alert severity="error" message={error.message || "An error occurred"} />;
  const { data: reviews, success, message } = data || {};
  if (!isLoading && !success) banner = <Alert severity="error" message={message} />;
  if (!isLoading && reviews?.length === 0) banner = <Alert severity="info" message="No reviews found" />;

  return (
    <>
      <SearchForm />
      <br />
      {banner}
      <Grid container spacing={2}>
        {reviews?.map((review) => (
          <ReviewItem key={review.review_id} review={review} />
        ))}
      </Grid>
    </>
  );
};

export default ReviewsList;
