import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";

import Footer from "@/components/Footer";
import TopMenuBar from "@/components/TopMenuBar";
import { useFetch } from "@/helpers/utils";

import MyProfile from "./MyProfile";

const App = ({ Component, pageProps }) => {
  const { data: { maintenanceMode } = { maintenanceMode: "false" } } = useFetch("/api/maintenance");

  return (
    <>
      <Head>
        <title>Share-A-Review App</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      {maintenanceMode === "true" && (
        <Backdrop sx={{ zIndex: 1200 }} open={true}>
          <Box
            bgcolor={"error.main"}
            color={"warning.contrastText"}
            p={2}
            mb={2}
            borderRadius={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={1300}
            data-testid="testid.maintenanceMessage"
          >
            This app is currently in maintenance mode. Please try again later.
          </Box>
        </Backdrop>
      )}
      <TopMenuBar />
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <Box padding={4} mb={6} mt={10} alignContent={"center"}>
          {pageProps.showProfile && <MyProfile />}
          <Component {...pageProps} />
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default App;
