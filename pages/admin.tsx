import { Typography, Grid } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { CategoriesSection } from "@/components/admin/CategoriesSection";
import { UsersSection } from "@/components/admin/UsersSection";

const AdminPage = () => {
  const router = useRouter();
  const section = (router.query.section as string) || "users";

  return (
    <Grid container>
      <Grid item xs={12} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Section Administration
        </Typography>

        {section === "categories" ? <CategoriesSection /> : <UsersSection />}
      </Grid>
    </Grid>
  );
};

export default AdminPage;
