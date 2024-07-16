import { Grid, Link, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, useState } from "react";

import { useFetch } from "@/helpers/utils";

import Alert from "./Alert";
import ItemCard from "./ItemCard";

interface HomePageSectionProps {
  type: "latestAddedItems" | "mostRecentReviewedItems" | "mostHighlyRatedItems";
  withAverageRating?: boolean;
  withCategoryFilter?: boolean;
}

const HomePageSection: FC<HomePageSectionProps> = ({ type, withAverageRating = false, withCategoryFilter = false }) => {
  const { t } = useTranslation();
  let apiPath = "";
  switch (type) {
    case "latestAddedItems":
      apiPath = "/api/items?type=most.recent";
      break;
    case "mostRecentReviewedItems":
      apiPath = "/api/items?type=latest.reviewed";
      break;
    case "mostHighlyRatedItems":
      apiPath = "/api/items?type=most.rated";
      break;
    default:
      break;
  }
  const { data, isLoading, error } = useFetch(apiPath);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: dataCategories } = useFetch("/api/categories/list");

  const { data: categories } = dataCategories || {};
  let banner: JSX.Element = <></>;
  if (isLoading) banner = <div>Loading...</div>;
  if (error) banner = <Alert severity="error" message={error.message || "An error occurred"} />;
  const { data: items, success, message } = data || {};
  if (!isLoading && !success) banner = <Alert severity="error" message={message} />;
  if (!isLoading && items?.length === 0) banner = <Alert severity="info" message="No reviews found" />;

  return (
    <>
      <h2>
        {t(`home.${type}.title`)}
        {withCategoryFilter && (
          <>
            <Typography variant="body2" color="textSecondary" sx={{ display: "inline", marginLeft: 1 }}>
              {t("home.mostHighlyRatedItems.byCategory")}{" "}
            </Typography>
            {categories?.length > 0 &&
              categories.map((category) => (
                <Link
                  sx={{ marginLeft: 1, cursor: "pointer" }}
                  color={"inherit"}
                  variant="body2"
                  key={category.value}
                  onClick={() => {
                    setActiveCategory(category.value);
                  }}
                >
                  {category.label}
                </Link>
              ))}
          </>
        )}
      </h2>
      {banner}
      <Grid container spacing={2}>
        {items
          ?.filter((item) => activeCategory === "all" || item.item_category_slug === activeCategory)
          .map(
            (item, index) =>
              index < 4 && (
                <Grid item key={item.item_id} xs={12} sm={6} md={3}>
                  <ItemCard item={item} withAverageRating={withAverageRating} />
                </Grid>
              ),
          )}
      </Grid>
    </>
  );
};

export default HomePageSection;
