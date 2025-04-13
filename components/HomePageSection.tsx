import { Grid, Link, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { FC, JSX, useState } from "react";

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
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const apiPath = {
    latestAddedItems: "/api/items?type=most.recent",
    mostRecentReviewedItems: "/api/items?type=latest.reviewed",
    mostHighlyRatedItems: "/api/items?type=most.rated",
  }[type];

  const { data, isLoading, error } = useFetch(apiPath);
  const { data: dataCategories } = useFetch("/api/categories/list");

  const categories = dataCategories?.data || [];
  const items = data?.data || [];
  const success = data?.success;
  const message = data?.message;

  let banner: JSX.Element | null = null;
  if (isLoading) {
    banner = <div>Loading...</div>;
  } else if (error) {
    banner = <Alert severity="error" message={error.message || "An error occurred"} />;
  } else if (!success) {
    banner = <Alert severity="error" message={message || "An error occurred"} />;
  }

  const filteredItems = items.filter((item) => activeCategory === "all" || item.item_category_slug === activeCategory);

  return (
    <>
      <h2>
        {t(`home.${type}.title`)}
        {withCategoryFilter && (
          <>
            <Typography variant="body2" color="textSecondary" sx={{ display: "inline", marginLeft: 1 }}>
              {t("home.mostHighlyRatedItems.byCategory")}{" "}
            </Typography>
            {categories.length > 0 &&
              categories.map((category) => (
                <Link
                  sx={{ marginLeft: 1, cursor: "pointer" }}
                  color={"inherit"}
                  variant="body2"
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                >
                  {category.label}
                </Link>
              ))}
          </>
        )}
      </h2>
      <Grid container spacing={2}>
        {banner}
        {success && filteredItems.length === 0 ? (
          <Alert severity="info" message={t("home.noItemsFound")} />
        ) : (
          filteredItems.slice(0, 4).map((item) => (
            <Grid key={item.item_id} size={6}>
              <ItemCard item={item} withAverageRating={withAverageRating} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default HomePageSection;
