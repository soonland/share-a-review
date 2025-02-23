import {
  Edit as EditIcon,
  Add as AddIcon,
  TextFields,
  Numbers,
  List as ListIcon,
  ExpandMore,
  ChevronLeft as CollapseIcon,
  MenuOpen as ExpandIcon,
} from "@mui/icons-material";
import {
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
  Stack,
  Menu,
  MenuItem,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { CategoryType } from "@/models/types";

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFieldOptions, setSelectedFieldOptions] = useState<string[]>([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

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
      if (selectedCategory) {
        const response = await axios.patch(`/api/categories/${selectedCategory.id}`, data);
        if (response.data.success) {
          setCategories((prevCategories) =>
            prevCategories.map((cat) => (cat.id === selectedCategory.id ? response.data.data : cat)),
          );
        }
      } else {
        const response = await axios.post("/api/categories", data);
        if (response.data.success) {
          setCategories((prevCategories) => [...prevCategories, response.data.data]);
        }
      }
      setOpenCategoryDialog(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error(`Erreur lors de la ${selectedCategory ? "modification" : "création"} de la catégorie:`, error);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditCategory = (category: CategoryType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setOpenCategoryDialog(true);
  };

  const filteredCategories = categories.filter((category) => {
    return !searchText || category.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const renderFieldChips = (category: CategoryType) => {
    type FieldConfig = {
      type: "text" | "number" | "select";
      options?: string[];
      required?: boolean;
    };

    const descriptionTemplate = category.description_template as Record<string, string | FieldConfig>;

    const getFieldIcon = (type: string) => {
      switch (type) {
        case "text":
          return <TextFields fontSize="small" />;
        case "number":
          return <Numbers fontSize="small" />;
        case "select":
          return <ListIcon fontSize="small" />;
        default:
          return null;
      }
    };

    const getFieldColor = (type: string): "default" | "primary" | "secondary" => {
      switch (type) {
        case "text":
          return "default";
        case "number":
          return "default";
        case "select":
          return "secondary";
        default:
          return "default";
      }
    };

    return (
      <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
        {Object.entries(descriptionTemplate || {}).map(([field, fieldConfig], index) => {
          const config: FieldConfig =
            typeof fieldConfig === "string"
              ? { type: fieldConfig as "text" | "number" | "select" }
              : (fieldConfig as FieldConfig);
          const { type, options, required } = config;

          const label = (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {getFieldIcon(type)}
              <span>{field}</span>
              {required && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Box>
          );

          const handleClick = (event: React.MouseEvent<HTMLDivElement>, opts: string[]) => {
            event.stopPropagation();
            setAnchorEl(event.currentTarget);
            setSelectedFieldOptions(opts);
          };

          const chipContent = (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {label}
              {options && <ExpandMore fontSize="small" sx={{ ml: 0.5 }} />}
            </Box>
          );

          return (
            <Chip
              key={index}
              label={chipContent}
              variant="outlined"
              color={getFieldColor(type)}
              size="small"
              onClick={options ? (e) => handleClick(e, options) : undefined}
              sx={options ? { cursor: "pointer" } : undefined}
            />
          );
        })}
      </Stack>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <Grid container spacing={2} sx={{ overflow: "hidden" }}>
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
              Catégories
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
          {!isCollapsed && (
            <Button
              variant="contained"
              onClick={() => {
                setSelectedCategory(null);
                setOpenCategoryDialog(true);
              }}
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Nouvelle catégorie
            </Button>
          )}
        </Box>
      </Grid>

      <Grid
        item
        xs={isCollapsed ? 11 : 9}
        sx={{
          transition: "all 0.2s ease-in-out",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Catégories
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Rechercher"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <List>
            {filteredCategories.map((category) => (
              <ListItem
                key={category.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  mb: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      {category.name}
                    </Typography>
                  }
                  secondary={renderFieldChips(category)}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={(e) => handleEditCategory(category, e)} size="small">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>

      <CategoryForm
        open={openCategoryDialog}
        onClose={() => {
          setOpenCategoryDialog(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleCreateOrUpdateCategory}
        category={selectedCategory || undefined}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: { maxHeight: "300px" },
        }}
      >
        {selectedFieldOptions.map((option, index) => (
          <MenuItem key={index} onClick={handleCloseMenu}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Grid>
  );
};
