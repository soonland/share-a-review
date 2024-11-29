import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import useSWR from "swr";

import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import { fetcher } from "@/helpers/utils";

const Notifications = () => {
  const { t } = useTranslation();
  const session = useSession();
  const { data, error, isLoading } = useSWR(
    session ? "/api/notifications" : null, // URL ou null si pas connecté
    fetcher,
  );

  const {
    data: dataFolder,
    error: errorFolder,
    isLoading: isLoadingFolder,
  } = useSWR(
    session ? "/api/notificationsfolders" : null, // URL ou null si pas connecté
    fetcher,
  );

  return (
    <div>
      <h1>Notifications</h1>

      {error || errorFolder ? <p>{t("notifications.error")}</p> : null}
      {isLoading || isLoadingFolder ? <p>{t("notifications.loading")}</p> : null}
      {data && dataFolder && <NotificationsPanel notifications={data.data} folders={dataFolder.data} />}
    </div>
  );
};

export default Notifications;
