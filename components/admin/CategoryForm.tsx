import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from "@mui/icons-material";
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
  id: string;
  name: string;
  type: CategoryFieldType["type"];
  options: string[];
  required?: boolean;
}

interface FieldChangeValue {
  name: string;
  type: CategoryFieldType["type"];
  required: boolean;
}

interface SortableFieldProps {
  field: FieldState;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, key: keyof FieldState, value: FieldChangeValue[keyof FieldChangeValue]) => void;
  onOptionAdd: (index: number, option: string) => void;
  onOptionRemove: (fieldIndex: number, optionIndex: number) => void;
}

const SortableField = ({ field, index, onRemove, onChange, onOptionAdd, onOptionRemove }: SortableFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim()) {
      onOptionAdd(index, newOption.trim());
      setNewOption("");
    }
  };

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid",
        borderColor: isDragging ? "primary.main" : "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        width: "100%",
        mb: 2,
        boxShadow: isDragging ? 3 : 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="small" sx={{ cursor: "grab", mr: 1 }} {...attributes} {...listeners}>
            <DragIcon fontSize="small" />
          </IconButton>
          <TextField
            label="Nom du champ"
            value={field.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            size="small"
            required
            sx={{ width: 200 }}
          />
        </Box>
        <FormControl size="small" sx={{ width: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={field.type}
            label="Type"
            onChange={(e) => onChange(index, "type", e.target.value as CategoryFieldType["type"])}
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
                onChange={(e) => onChange(index, "required", e.target.checked)}
                size="small"
              />
            }
            label="Requis"
          />
          <IconButton onClick={() => onRemove(index)} color="error" size="small">
            <DeleteIcon fontSize="small" />
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
              <Chip key={optionIndex} label={option} onDelete={() => onOptionRemove(index, optionIndex)} size="small" />
            ))}
          </Box>
          <TextField
            placeholder="Ajouter une option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
            size="small"
            fullWidth
            helperText="Appuyez sur Entrée pour ajouter"
          />
        </Box>
      )}
    </Box>
  );
};

export const CategoryForm = ({ open, onClose, onSubmit, category }: CategoryFormProps) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [fields, setFields] = useState<FieldState[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[-]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-") // Replace special chars with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    setSlug(generateSlug(name));
  }, [name]);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug);
      const initialFields = Object.entries(category.description_template || {}).map(([name, field], index) => {
        const fieldConfig = typeof field === "string" ? { type: field } : field;
        return {
          id: `field-${index}`,
          name,
          type: fieldConfig.type,
          options: fieldConfig.type === "select" ? fieldConfig.options || [] : [],
          required: fieldConfig.required || false,
        };
      });
      setFields(initialFields);
    } else {
      setName("");
      setSlug("");
      setFields([]);
    }
  }, [category]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = () => {
    setFields([...fields, { id: `field-${fields.length}`, name: "", type: "text", options: [] }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: keyof FieldState, value: FieldChangeValue[keyof FieldChangeValue]) => {
    const newFields = [...fields];
    if (key === "type" && (value === "text" || value === "number" || value === "select")) {
      newFields[index][key] = value;
      if (value !== "select") {
        newFields[index].options = [];
      }
    } else if (key === "name" && typeof value === "string") {
      newFields[index].name = value;
    } else if (key === "required" && typeof value === "boolean") {
      newFields[index].required = value;
    }
    setFields(newFields);
  };

  const handleAddOption = (index: number, option: string) => {
    if (option.trim()) {
      const newFields = [...fields];
      newFields[index].options.push(option.trim());
      setFields(newFields);
    }
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
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
      name,
      slug,
      description_template,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{category ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Nom de la catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Slug"
            value={slug}
            disabled
            fullWidth
            helperText="Identifiant unique généré automatiquement à partir du nom"
            sx={{ bgcolor: "action.disabledBackground" }}
          />

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1">Champs du formulaire</Typography>
              <Button startIcon={<AddIcon />} onClick={handleAddField} variant="outlined" size="small">
                Ajouter un champ
              </Button>
            </Box>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext items={fields.map((f) => f.id)}>
                {fields.map((field, index) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    index={index}
                    onRemove={handleRemoveField}
                    onChange={handleFieldChange}
                    onOptionAdd={handleAddOption}
                    onOptionRemove={handleRemoveOption}
                  />
                ))}
              </SortableContext>
            </DndContext>
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
