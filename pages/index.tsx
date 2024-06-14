import { Grid } from "@mui/material";
import { useSession } from "next-auth/react";

const Home = () => {
  const session = useSession();

  return (
    <Grid container flexDirection={"column"} spacing={2}>
      {session.status === "authenticated" && (
        <Grid item>
          <h1>Search</h1>
          <p>Search for your favorite artist, album or track</p>
        </Grid>
      )}
    </Grid>
  );
};

export default Home;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: true,
    },
  };
};
