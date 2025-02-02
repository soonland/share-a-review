import Switch from "@mui/material/Switch"; // Importer le composant Switch
import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState<
    {
      id: number;
      name: string;
      email: string;
      is_admin: boolean;
      active: boolean;
      last_login: string;
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true); // État de chargement

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.data); // Mise à jour de l'état des utilisateurs
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchUsers();
  }, []);

  const handleAdminToggle = async (userId, isAdmin) => {
    try {
      await axios.patch(`/api/users/${userId}`, { isAdmin: !isAdmin });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_admin: !isAdmin } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut admin:", error);
    }
  };

  return (
    <div>
      <h1>Section Administration</h1>
      <p>Bienvenue dans la section administration</p>
      {/* Ajoutez ici les composants et fonctionnalités d'administration */}
      <h2>Liste des utilisateurs</h2>
      {loading ? (
        <p>Chargement...</p> // Afficher un message de chargement
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actif</th>
              <th>Dernière connexion</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Switch checked={user.is_admin} onChange={() => handleAdminToggle(user.id, user.is_admin)} />
                </td>
                <td>{user.active ? "Oui" : "Non"}</td>
                <td>{user.last_login}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
