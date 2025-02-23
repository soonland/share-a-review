import { NextPage } from "next";
import { useRouter } from "next/router";

import ReviewsList from "@/components/ReviewsList";
import { useFetch } from "@/helpers/utils";

const Reviews: NextPage = () => {
  const router = useRouter();
  const { category = "", q = "" } = router.query;
  let url = "/api/reviews";
  const params = new URLSearchParams();
  if (category) params.append("category", category as string);
  if (q) params.append("q", q as string);
  if (params.toString()) url += `?${params.toString()}`;
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
