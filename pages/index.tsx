import { Box, Grid } from "@mui/material";
import useTranslation from "next-translate/useTranslation";

import Alert from "@/components/Alert";
import ItemCard from "@/components/ItemCard";
import { useFetch } from "@/helpers/utils";

const Home = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useFetch("/api/items?type=latest.reviewed");

  let banner: JSX.Element = <></>;
  if (isLoading) banner = <div>Loading...</div>;
  if (error) banner = <Alert severity="error" message={error.message || "An error occurred"} />;
  const { data: items, success, message } = data || {};
  if (!isLoading && !success) banner = <Alert severity="error" message={message} />;
  if (!isLoading && items?.length === 0) banner = <Alert severity="info" message="No reviews found" />;

  return (
    <Box>
      <h1>{t("home.recentReviews")}</h1>
      {banner}
      <Grid container spacing={2}>
        {items?.map((item) => (
          <Grid item key={item.item_id} xs={12} sm={6} md={3}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
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
