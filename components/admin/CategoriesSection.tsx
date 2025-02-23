import { Edit as EditIcon } from "@mui/icons-material";
import { Typography, Button, Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryType } from "@/models/types";

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories/list");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchCategories();
  }, []);

  const handleCreateOrUpdateCategory = async (data: Omit<CategoryType, "id">) => {
    try {
      if (editingCategory) {
        const response = await axios.patch(`/api/categories/${editingCategory.id}`, data);
        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.map((cat) => (cat.id === editingCategory.id ? response.data.data : cat)),
          );
        }
      } else {
        const response = await axios.post("/api/categories", data);
        if (response.data.success) {
          setCategories((prevCategories) => [...prevCategories, response.data.data]);
        }
      }
      setOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error(`Erreur lors de la ${editingCategory ? "modification" : "création"} de la catégorie:`, error);
    }
  };

  const handleEditCategory = (category: CategoryType) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "slug", headerName: "Slug", flex: 1 },
    {
      field: "description_template",
      headerName: "Champs",
      flex: 2,
      renderCell: (params) => {
        const descriptionTemplate = params.row.description_template as Record<
          string,
          | string
          | {
              type: "text" | "number" | "select";
              options?: string[];
            }
        >;

        const fields = Object.entries(descriptionTemplate || {}).map(([field, fieldType]) => {
          const type = typeof fieldType === "string" ? fieldType : fieldType.type;
          const options = typeof fieldType === "object" && "options" in fieldType ? fieldType.options : undefined;
          const displayType = type === "text" ? "texte" : type === "number" ? "numérique" : type;
          return `${field}: ${displayType}${options ? ` (${options.join(", ")})` : ""}`;
        });

        return <div style={{ whiteSpace: "pre-line" }}>{fields.join("\n")}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditCategory(params.row)} color="primary" size="small">
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">Catégories</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Nouvelle catégorie
        </Button>
      </Box>

      <DataGrid
        rows={categories}
        columns={columns}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        autoHeight
        hideFooterSelectedRowCount
        getRowHeight={() => "auto"}
      />

      <CategoryForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCreateOrUpdateCategory}
        category={editingCategory || undefined}
      />
    </Box>
  );
};
