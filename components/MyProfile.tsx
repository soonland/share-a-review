import { Avatar } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { signIn, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { FC, ReactElement } from "react";

const MyProfile: FC = (): ReactElement => {
  const session = useSession();
  const { t } = useTranslation();

  if (session.status === "loading") {
    return <Skeleton variant="rectangular" width={210} height={60} data-testid="testid.loading" />;
  }

  if (session.status === "authenticated") {
    return (
      <Grid container flexDirection={"row"} alignItems={"center"} data-testid="testid.grid" mb={2}>
        <Avatar src={session?.data?.user?.image} alt={session.data?.user?.name}>
          {session.data?.user?.name?.charAt(0)}
        </Avatar>
        <Typography ml={1} fontWeight={400}>
          {t("common.signedInAs", { name: session.data?.user?.name })}
        </Typography>
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography>{t("common.notSignedIn")}</Typography>
      <Button variant="outlined" onClick={() => signIn()} data-testid="testid.button">
        {t("common.signIn")}
      </Button>
    </Box>
  );
};

export default MyProfile;
