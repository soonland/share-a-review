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
    {
      refreshInterval: 5000, // rafraîchissement toutes les minutes
    },
  );

  return (
    <div>
      <h1>Notifications</h1>

      {error ? <p>{t("notifications.error")}</p> : null}
      {isLoading ? <p>{t("notifications.loading")}</p> : null}
      {data && <NotificationsPanel notifications={data.data} />}
    </div>
  );
};

export default Notifications;
