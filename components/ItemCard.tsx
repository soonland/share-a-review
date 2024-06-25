import { Card, CardContent, Rating, Typography } from "@mui/material";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

interface ItemDescriptionProps {
  [key: string]: string;
}

const ItemDescription: FC<ItemDescriptionProps> = (props) => {
  const entries = Object.entries(props);
  return entries.map(([key, value]) => (
    <Typography key={key} variant="body2" component="p">
      <Typography component="span" variant="subtitle1" fontWeight="700">
        {key}:{" "}
      </Typography>
      <Typography component="span">{value}</Typography>
    </Typography>
  ));
};

interface ItemCardProps {
  withAverageRating?: boolean;
  item: {
    item_name: string;
    item_slug: string;
    item_category_name: string;
    item_category_slug: string;
    item_description: ItemDescriptionProps;
    item_average_rating: number;
    item_number_of_reviews: number;
  };
}

const ItemCard: FC<ItemCardProps> = ({ item, withAverageRating = false }) => {
  const { t } = useTranslation();
  const { item_name, item_slug, item_category_name, item_category_slug, item_description } = item;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          <Link href={`/items/${item_slug}`} color="inherit">
            {item_name}
          </Link>
        </Typography>
        <Typography color="textSecondary" className="category-name">
          <Link href={`/categories/${item_category_slug}`} color="inherit">
            {item_category_name}
          </Link>
        </Typography>
        {withAverageRating && (
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
        )}
        <ItemDescription {...item_description} />
      </CardContent>
    </Card>
  );
};

export default ItemCard;
