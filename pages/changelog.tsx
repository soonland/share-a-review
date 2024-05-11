import ChangeLog from "@/components/ChangeLog";

const Home = () => {
  return (
    <div>
      <main>
        <ChangeLog />
      </main>
    </div>
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
