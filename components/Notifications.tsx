import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

import { fetcher } from "@/helpers/utils";

import NotificationsPanel from "./NotificationsPanel";

const Notifications = () => {
  const session = useSession();
  const { data, error, isLoading } = useSWR(
    session ? "/api/notifications" : null, // URL ou null si pas connecté
    fetcher,
    {
      refreshInterval: 5000, // rafraîchissement toutes les 5 secondes
    },
  );

  return (
    <div>
      <h1>Notifications</h1>

      {error ? <p>Erreur lors de la récupération des notifications</p> : null}
      {isLoading ? <p>Chargement des notifications...</p> : null}
      {data && <NotificationsPanel notifications={data.data} />}
    </div>
  );
};

export default Notifications;
