import HomePageSection from "@/components/HomePageSection";
import Introduction from "@/components/Introduction";

const Home = () => {
  return (
    <>
      <Introduction />
      <HomePageSection type="latestAddedItems" />
      <HomePageSection type="mostRecentReviewedItems" />
      <HomePageSection type="mostHighlyRatedItems" withAverageRating withCategoryFilter />
    </>
  );
};

export default Home;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
