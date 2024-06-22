import { Typography, Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const Introduction = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ px: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        {t("home.welcomeTitle")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t("home.welcomeMessage")}
      </Typography>
    </Box>
  );
};

export default Introduction;
