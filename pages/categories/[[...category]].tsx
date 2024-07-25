import { NextPage } from "next";
import { useRouter } from "next/router";

import ReviewsList from "@/components/ReviewsList";
import { useFetch } from "@/helpers/utils";

const Reviews: NextPage = () => {
  const router = useRouter();
  const { category = "", q = "" } = router.query;
  let url = `/api/categories`;
  if (category) {
    url += `/${category}`;
  }
  if (q) {
    url += `?q=${q}`;
  }
  const { data, isLoading, error } = useFetch(url);

  return <ReviewsList data={data} isLoading={isLoading} error={error} />;
};

export default Reviews;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
