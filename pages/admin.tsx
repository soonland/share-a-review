import { Container, Typography, CircularProgress, TextField } from "@mui/material"; // Importer les composants MUI
import Switch from "@mui/material/Switch";
import { DataGrid } from "@mui/x-data-grid"; // Importer le composant DataGrid
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
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // État pour le texte de recherche
  const [filteredUsers, setFilteredUsers] = useState(users); // État pour les utilisateurs filtrés

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); // Initialiser les utilisateurs filtrés
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, users]);

  const handleAdminToggle = async (userId, isAdmin) => {
    try {
      await axios.patch(`/api/users/${userId}`, { isAdmin: !isAdmin });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_admin: !isAdmin } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut admin:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "is_admin",
      headerName: "Admin",
      renderCell: (params) => (
        <Switch checked={params.value} onChange={() => handleAdminToggle(params.row.id, params.value)} />
      ),
    },
    { field: "active", headerName: "Actif", flex: 1, renderCell: (params) => (params.value ? "Oui" : "Non") },
    { field: "last_login", headerName: "Dernière connexion", flex: 1 },
    { field: "created_at", headerName: "Créé le", flex: 1 },
  ];

  return (
    <Container>
      <Typography variant="h2">Section Administration</Typography>
      <Typography variant="h3">Liste des utilisateurs</Typography>
      <TextField
        label="Rechercher"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 20 }}
        size="small"
      />
      {loading ? (
        <CircularProgress /> // Afficher un indicateur de chargement
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default AdminPage;
