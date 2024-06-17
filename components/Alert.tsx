import { Alert as MuiAlert, useTheme } from "@mui/material";
import React from "react";

export interface AlertProps {
  severity?: "error" | "warning" | "info" | "success";
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ severity, message }) => {
  const theme = useTheme();
  return (
    <MuiAlert
      severity={severity}
      sx={{ marginBottom: theme.spacing(1), borderRadius: theme.spacing(4), marginX: theme.spacing(4) }}
    >
      {message}
    </MuiAlert>
  );
};

export default Alert;
