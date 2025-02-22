import {
  SelectAll as SelectAllIcon,
  ClearAll as ClearAllIcon,
  PeopleOutline as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  ChevronLeft as CollapseIcon,
  MenuOpen as ExpandIcon,
} from "@mui/icons-material";
import {
  Typography,
  CircularProgress,
  TextField,
  Grid,
  Button,
  Box,
  Badge,
  Divider,
  Switch,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [currentView, setCurrentView] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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
    let filtered = users;

    // Filtre de recherche
    filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()),
    );

    // Filtre par vue
    switch (currentView) {
      case "admins":
        filtered = filtered.filter((user) => user.is_admin);
        break;
      case "active":
        filtered = filtered.filter((user) => user.active);
        break;
      case "inactive":
        filtered = filtered.filter((user) => !user.active);
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  }, [searchText, users, currentView]);

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

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
      {/* Barre latérale des filtres */}
      <Grid
        item
        xs={isCollapsed ? 1 : 3}
        sx={{
          width: isCollapsed ? 80 : "auto",
          minWidth: isCollapsed ? 80 : "auto",
          maxWidth: isCollapsed ? 80 : "25%",
          borderRight: "1px solid #ddd",
          p: 2,
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {!isCollapsed && (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Filtres
            </Typography>
          )}
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              ml: isCollapsed ? "auto" : 1,
            }}
          >
            {isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant={currentView === "all" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView("all")}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <PeopleIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>Tous les utilisateurs</span>
                  <Badge color="primary" badgeContent={users.length} />
                </Box>
              )}
            </Box>
          </Button>

          <Button
            variant={currentView === "admins" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView("admins")}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <AdminIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>Administrateurs</span>
                  <Badge color="primary" badgeContent={users.filter((u) => u.is_admin).length} />
                </Box>
              )}
            </Box>
          </Button>

          <Button
            variant={currentView === "active" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView("active")}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ActiveIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>Utilisateurs actifs</span>
                  <Badge color="primary" badgeContent={users.filter((u) => u.active).length} />
                </Box>
              )}
            </Box>
          </Button>

          <Button
            variant={currentView === "inactive" ? "contained" : "text"}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              minWidth: isCollapsed ? 48 : "auto",
              width: "100%",
              px: isCollapsed ? 1 : 2,
            }}
            onClick={() => setCurrentView("inactive")}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <InactiveIcon sx={{ mr: 1 }} />
              {!isCollapsed && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>Utilisateurs inactifs</span>
                  <Badge color="error" badgeContent={users.filter((u) => !u.active).length} />
                </Box>
              )}
            </Box>
          </Button>
        </Box>
      </Grid>

      {/* Section principale */}
      <Grid
        item
        xs={isCollapsed ? 11 : 9}
        sx={{
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Section Administration
          </Typography>

          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
              label="Rechercher"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleSelectAll}
              startIcon={selectAll ? <ClearAllIcon /> : <SelectAllIcon />}
            >
              {selectAll ? "Tout désélectionner" : "Tout sélectionner"}
            </Button>
          </Box>

          {loading ? (
            <CircularProgress />
          ) : (
            <Box>
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
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminPage;
