import { Alert as MuiAlert, useTheme, AlertProps as MuiAlertProps } from "@mui/material";
import { FC } from "react";

export interface AlertProps extends MuiAlertProps {
  message?: string;
}

const Alert: FC<AlertProps> = ({ message, ...props }) => {
  const theme = useTheme();
  return (
    <MuiAlert
      {...props}
      sx={{ marginBottom: theme.spacing(1), borderRadius: theme.spacing(4), marginX: theme.spacing(4) }}
    >
      {message}
    </MuiAlert>
  );
};

export default Alert;
