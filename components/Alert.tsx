import { Alert as MuiAlert } from "@mui/material";
import React from "react";

export interface AlertProps {
  severity?: "error" | "warning" | "info" | "success";
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ severity, message }) => {
  return <MuiAlert severity={severity}>{message}</MuiAlert>;
};

export default Alert;
