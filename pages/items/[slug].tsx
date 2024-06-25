import { Grid } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { JSX } from "react";
import useSWR from "swr";

import Alert from "@/components/Alert";
import ReviewItem from "@/components/ReviewItem";
import SearchForm from "@/components/SearchForm";

const Reviews: NextPage = () => {
  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    clearTimeout(timeoutId);
    return fetch(`${url}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          return { success: false, message: "An error occurred while fetching the data." };
        }
        return res.json();
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });
  };

  const router = useRouter();
  const { slug } = router.query;
  const url = `/api/items/${slug}`;

  const { data, isLoading, error } = useSWR(url, fetcher);

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
