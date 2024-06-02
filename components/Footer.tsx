import { Typography, styled } from "@mui/material";
import Box from "@mui/material/Box";
import { FC, ReactElement } from "react";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  marginTop: "calc(10% + 120px)",
  position: "fixed",
  bottom: 0,
  width: "100%",
}));

const Footer: FC = (): ReactElement => {
  const versionNumber = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? "local";
  return (
    <StyledFooter
      sx={{ flexGrow: 1 }}
      alignContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      data-testid="testid.footer"
    >
      <Typography variant={"body2"}>© {new Date().getFullYear()}</Typography>
      <Typography variant={"body2"}>{versionNumber}</Typography>
    </StyledFooter>
  );
};

export default Footer;
