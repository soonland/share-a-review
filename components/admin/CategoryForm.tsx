import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import { CategoryFieldType, CategoryType } from "@/models/types";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CategoryType, "id">) => void;
  category?: CategoryType;
}

interface FieldState {
  name: string;
  type: CategoryFieldType["type"];
  options: string[];
  required?: boolean;
}

export const CategoryForm = ({ open, onClose, onSubmit, category }: CategoryFormProps) => {
  const [slug, setSlug] = useState("");
  const [fields, setFields] = useState<FieldState[]>([]);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    if (category) {
      setSlug(category.slug);
      const initialFields = Object.entries(category.description_template || {}).map(([name, field]) => {
        const fieldConfig = typeof field === "string" ? { type: field } : field;
        return {
          name,
          type: fieldConfig.type,
          options: fieldConfig.type === "select" ? fieldConfig.options || [] : [],
          required: fieldConfig.required || false,
        };
      });
      setFields(initialFields);
    } else {
      setSlug("");
      setFields([]);
    }
  }, [category]);

  const handleAddField = () => {
    setFields([...fields, { name: "", type: "text", options: [] }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: keyof FieldState, value: string) => {
    const newFields = [...fields];
    if (key === "type" && (value === "text" || value === "number" || value === "select")) {
      newFields[index][key] = value;
      if (value !== "select") {
        newFields[index].options = [];
      }
    } else if (key === "name") {
      newFields[index].name = value;
    }
    setFields(newFields);
  };

  const handleAddOption = (index: number, option: string) => {
    if (option.trim()) {
      const newFields = [...fields];
      newFields[index].options.push(option.trim());
      setFields(newFields);
      setNewOption("");
    }
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const handleOptionKeyPress = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" && newOption.trim()) {
      e.preventDefault();
      handleAddOption(index, newOption);
    }
  };

  const handleRequiredChange = (index: number, checked: boolean) => {
    const newFields = [...fields];
    newFields[index].required = checked;
    setFields(newFields);
  };

  const handleSubmit = () => {
    const description_template = fields.reduce(
      (acc, field) => {
        if (field.name) {
          acc[field.name] = {
            type: field.type,
            ...(field.type === "select" && { options: field.options }),
            ...(field.required && { required: field.required }),
          };
        }
        return acc;
      },
      {} as CategoryType["description_template"],
    );

    onSubmit({
      slug: slug.toLowerCase(),
      description_template,
    });

    setNewOption("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            required
            helperText="Identifiant unique de la catégorie (ex: smartphones, laptops)"
          />

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1">Champs du formulaire</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddField} variant="outlined" size="small">
                Ajouter un champ
              </Button>
            </Box>

            {fields.map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  mb: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    label="Nom du champ"
                    value={field.name}
                    onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                    size="small"
                    required
                    sx={{ flex: 2 }}
                  />
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={field.type}
                      label="Type"
                      onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                    >
                      <MenuItem value="text">Texte</MenuItem>
                      <MenuItem value="number">Nombre</MenuItem>
                      <MenuItem value="select">Liste de valeurs</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.required || false}
                          onChange={(e) => handleRequiredChange(index, e.target.checked)}
                        />
                      }
                      label="Requis"
                    />
                    <IconButton onClick={() => handleRemoveField(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {field.type === "select" && (
                  <Box
                    sx={{
                      px: 2,
                      pb: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: 2,
                    }}
                  >
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: "block" }}>
                      Options de la liste
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                      {field.options.map((option, optionIndex) => (
                        <Chip
                          key={optionIndex}
                          label={option}
                          onDelete={() => handleRemoveOption(index, optionIndex)}
                          size="small"
                        />
                      ))}
                    </Box>
                    <TextField
                      placeholder="Ajouter une option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => handleOptionKeyPress(e, index)}
                      size="small"
                      fullWidth
                      helperText="Appuyez sur Entrée pour ajouter"
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!slug || fields.length === 0 || fields.some((f) => !f.name)}
        >
          {category ? "Modifier" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
