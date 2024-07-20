import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { JSX } from "react";

import Alert from "@/components/Alert";
import ReviewItem from "@/components/ReviewItem";
import SearchForm from "@/components/SearchForm";
import { useFetch } from "@/helpers/utils";

const Reviews: NextPage = () => {
  const router = useRouter();
  const { category = "", q = "" } = router.query;
  let url = `/api/categories`;
  if (category) {
    url += `/${category}`;
  }
  if (q) {
    url += `?q=${q}`;
  }
  const { data, isLoading, error } = useFetch(url);

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
        {reviews?.map((review) => <ReviewItem key={review.review_id} review={review} />)}
      </Grid>
    </>
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
