import { ParsedUrlQuery } from "querystring";

import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWRMutation from "swr/mutation";

const Home = () => {
  const session = useSession();
  const router = useRouter();

  const fetcher = async (url: string, { arg }: { arg: { searchType: string; searchString: string } }) => {
    if (arg.searchType === undefined) {
      arg.searchType = "album,artist,track";
    }

    const parameterizedQuery = new URLSearchParams({
      q: arg.searchString,
      type: arg.searchType,
    }).toString();
    const res = await fetch(`${url}?${parameterizedQuery}`);
    return await res.json();
  };

  const { /* data, isMutating, */ trigger } = useSWRMutation("/api/search", fetcher);

  const handleSearch = (searchQuery: ParsedUrlQuery) => {
    const searchString = searchQuery.q as string;
    const searchType = searchQuery.type as string;
    trigger({ searchType, searchString });
  };

  useEffect(() => {
    if (router.query.q) {
      handleSearch(router.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.q, router.query.type]);

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
