/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardActionArea, CardContent, Grid, styled, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import Alert from "@/components/Alert";
import CreateForm from "@/components/CreateForm";
import { useFetch } from "@/helpers/utils";
import { CategoryType } from "@/models/types";

const CustomCard = styled(Card)(({ theme }) => ({
  "&.MuiPaper-root.MuiPaper-elevation.MuiCard-root": {
    backgroundColor: "green",
    color: theme.palette.primary.main,
  },
}));

interface CategoryWithTemplate {
  id: number;
  value: string;
  label: string;
  description_template: CategoryType["description_template"];
}

const CreateItem: NextPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithTemplate>({
    id: 0,
    value: "",
    label: "",
    description_template: { name: { type: "text" } },
  });

  const { data, error } = useFetch("/api/categories/list");
  const categories = data?.data;

  if (error) return <Alert severity="error" message={error.message || "An error occurred"} />;
  if (!categories) return <div>Loading...</div>;
  if (categories.length === 0) return <Alert severity="info" message="No categories found" />;

  return (
    <Grid container spacing={2}>
      {categories.map((category: any) => (
        <Grid key={category.id} size={12}>
          <CustomCard variant={selectedCategory.id === category.id ? "elevation" : "outlined"}>
            <CardActionArea onClick={() => setSelectedCategory(category)}>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
                  {category.slug}
                </Typography>
              </CardContent>
            </CardActionArea>
          </CustomCard>
        </Grid>
      ))}
      {selectedCategory.description_template && (
        <Grid size={12}>
          <CreateForm descriptionTemplate={selectedCategory.description_template} categoryId={selectedCategory.id} />
        </Grid>
      )}
    </Grid>
  );
};

export default CreateItem;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
