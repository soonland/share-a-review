import { Typography, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import React from "react";

import { CategoriesSection } from "@/components/admin/CategoriesSection";
import { UsersSection } from "@/components/admin/UsersSection";

import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.is_admin) {
    return {
      notFound: true, // Returns 404 page
    };
  }

  return {
    props: {}, // Will be passed to the page component as props
  };
};

const AdminPage = () => {
  const router = useRouter();
  const section = (router.query.section as string) || "users";

  return (
    <Grid container>
      <Grid size={12} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Section Administration
        </Typography>

        {section === "categories" ? <CategoriesSection /> : <UsersSection />}
      </Grid>
    </Grid>
  );
};

export default AdminPage;
