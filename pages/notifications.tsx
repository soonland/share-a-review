import Notifications from "@/components/Notifications";

const NotificationsPage = () => {
  return (
    <div>
      <main>
        <Notifications />
      </main>
    </div>
  );
};

export default NotificationsPage;

export const getServerSideProps = async () => {
  return {
    props: {
      showProfile: false,
    },
  };
};
