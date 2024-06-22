import { Grid, Rating, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

import Alert from "@/components/Alert";
import Introduction from "@/components/Introduction";
import ItemCard from "@/components/ItemCard";
import { useFetch } from "@/helpers/utils";

const Home = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useFetch("/api/items?type=latest.reviewed");
  const {
    data: mostRecent,
    isLoading: mostRecentLoading,
    error: mostRecentError,
  } = useFetch("/api/items?type=most.recent");
  const {
    data: mostRated,
    isLoading: mostRatedLoading,
    error: mostRatedError,
  } = useFetch("/api/items?type=most.rated");

  let banner: JSX.Element = <></>;
  if (isLoading) banner = <div>Loading...</div>;
  if (error) banner = <Alert severity="error" message={error.message || "An error occurred"} />;
  const { data: items, success, message } = data || {};
  if (!isLoading && !success) banner = <Alert severity="error" message={message} />;
  if (!isLoading && items?.length === 0) banner = <Alert severity="info" message="No reviews found" />;

  let banner2: JSX.Element = <></>;
  if (mostRecentLoading) banner2 = <div>Loading...</div>;
  if (mostRecentError) banner2 = <Alert severity="error" message={mostRecentError.message || "An error occurred"} />;
  const { data: mostRecentItems, success: mostRecentSuccess, message: mostRecentMessage } = mostRecent || {};
  if (!mostRecentLoading && !mostRecentSuccess) banner2 = <Alert severity="error" message={mostRecentMessage} />;
  if (!mostRecentLoading && mostRecentItems?.length === 0)
    banner2 = <Alert severity="info" message="No reviews found" />;

  let banner3: JSX.Element = <></>;
  if (mostRatedLoading) banner3 = <div>Loading...</div>;
  if (mostRatedError) banner3 = <Alert severity="error" message={mostRatedError.message || "An error occurred"} />;
  const { data: mostRatedItems, success: mostRatedSuccess, message: mostRatedMessage } = mostRated || {};
  if (!mostRatedLoading && !mostRatedSuccess) banner3 = <Alert severity="error" message={mostRatedMessage} />;
  if (!mostRatedLoading && mostRatedItems?.length === 0) banner3 = <Alert severity="info" message="No reviews found" />;

  return (
    <>
      <Introduction />
      <h1>{t("home.mostRecentReviewedItems")}</h1>
      {banner}
      <Grid container spacing={2}>
        {items?.map((item) => (
          <Grid item key={item.item_id} xs={12} sm={6} md={3}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
      <h2>{t("home.latestAddedItems")}</h2>
      {banner2}
      <Grid container spacing={2}>
        {mostRecentItems?.map((item) => (
          <Grid item key={item.item_id} xs={12} sm={6} md={3}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
      <h2>{t("home.mostRatedItems")}</h2>
      {banner3}
      <Grid container spacing={2}>
        {mostRatedItems?.map((item) => (
          <Grid item key={item.item_id} xs={12} sm={6} md={3}>
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Rating value={item.item_average_rating} name="rating" readOnly />
              <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
                {t("home.reviewNumber", { value: item.item_number_of_reviews })}
              </Typography>
            </Typography>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
