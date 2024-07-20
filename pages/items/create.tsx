/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Card, CardActionArea, CardContent, Grid, styled, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

import Alert from "@/components/Alert";
import CreateForm from "@/components/CreateForm";
import { useFetch } from "@/helpers/utils";

interface CreateItemProps {}

const CustomCard = styled(Card)(({ theme }) => ({
  "&.MuiPaper-root.MuiPaper-elevation.MuiCard-root": {
    backgroundColor: "green",
    color: theme.palette.primary.main,
  },
}));

const CreateItem: NextPage<CreateItemProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    value: string;
    label: string;
    description_template: unknown;
  }>({ id: 0, value: "", label: "", description_template: null });

  const { data, error } = useFetch("/api/categories/list");
  const categories = data?.data;

  if (error) return <Alert severity="error" message={error.message || "An error occurred"} />;
  if (!categories) return <div>Loading...</div>;
  if (categories.length === 0) return <Alert severity="info" message="No categories found" />;

  return (
    <>
      <Grid container spacing={2}>
        {categories.map((category: any) => (
          <Grid item key={category.value} xs={12} sm={6} md={3}>
            <CustomCard variant={selectedCategory.value === category.value ? "elevation" : "outlined"}>
              <CardActionArea onClick={() => setSelectedCategory(category)}>
                <CardContent>
                  <Typography variant="h6" component="h2" sx={{ textAlign: "center" }}>
                    {category.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </CustomCard>
          </Grid>
        ))}
      </Grid>
      {selectedCategory.description_template && (
        <Box mt={4}>
          <CreateForm descriptionTemplate={selectedCategory.description_template} categoryId={selectedCategory.id} />
        </Box>
      )}
    </>
  );
};

export default CreateItem;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
