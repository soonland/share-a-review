import { SelectAll as SelectAllIcon, ClearAll as ClearAllIcon } from "@mui/icons-material";
import { Typography, TextField, Button, Box, Divider, Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { UserType } from "@/models/types";

export const UsersSection = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleAdminToggle = async (userId: number, isAdmin: boolean) => {
    try {
      await axios.patch(`/api/users/${userId}`, { isAdmin: !isAdmin });
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_admin: !isAdmin } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut admin:", error);
    }
  };

  const columns = [
    {
      field: "select",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(params.row.id)}
          onChange={() => {
            setSelectedUsers((prev) =>
              prev.includes(params.row.id) ? prev.filter((id) => id !== params.row.id) : [...prev, params.row.id],
            );
          }}
        />
      ),
    },
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

  const adminUsers = filteredUsers.filter((user) => user.is_admin);
  const regularUsers = filteredUsers.filter((user) => !user.is_admin);

  const renderUserFilters = () => (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <TextField
        label="Rechercher"
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        sx={{ flexGrow: 1 }}
      />
      <Button variant="outlined" onClick={handleSelectAll} startIcon={selectAll ? <ClearAllIcon /> : <SelectAllIcon />}>
        {selectAll ? "Tout désélectionner" : "Tout sélectionner"}
      </Button>
    </Box>
  );

  if (loading) {
    return null;
  }

  return (
    <Box>
      {renderUserFilters()}
      <Typography variant="h6" gutterBottom>
        Administrateurs
      </Typography>
      <DataGrid
        rows={adminUsers}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        sx={{ mb: 4 }}
        autoHeight
        hideFooterSelectedRowCount
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Utilisateurs
      </Typography>
      <DataGrid
        rows={regularUsers}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        autoHeight
        hideFooterSelectedRowCount
      />
    </Box>
  );
};
