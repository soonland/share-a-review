import { NextPage } from "next";
import { useRouter } from "next/router";

import ReviewsList from "@/components/ReviewsList";
import { useFetch } from "@/helpers/utils";

const Items: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const url = `/api/items/${slug}`;

  const { data, isLoading, error } = useFetch(url);

  return <ReviewsList data={data} isLoading={isLoading} error={error} />;
};

export default Items;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
