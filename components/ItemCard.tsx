import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { FC } from "react";

interface ItemDescriptionProps {
  [key: string]: string;
}

const ItemDescription: FC<ItemDescriptionProps> = ({ item_description }) => {
  const entries = Object.entries(item_description);
  return entries.map(([key, value]) => (
    <Typography key={key} variant="body2" component="p">
      <Typography component="span" variant="subtitle1" fontWeight="700">
        {key}:{" "}
      </Typography>
      <Typography component="span">{value}</Typography>
    </Typography>
  ));
};

const ItemCard = ({ item }) => {
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
        <ItemDescription item_description={item_description} />
      </CardContent>
    </Card>
  );
};

export default ItemCard;
