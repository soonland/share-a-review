import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  Paper,
  SxProps,
  TextField,
  darken,
  styled,
} from "@mui/material";
import { useRouter } from "next/router";
import { FC } from "react";
import { Controller } from "react-hook-form";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  backgroundColor: darken(theme.palette.primary.main, 0.2),
}));

const GroupItems = styled("ul")({
  padding: 0,
  '& .MuiAutocomplete-option[aria-selected="true"]': {
    backgroundColor: "rgb(237, 247, 237)",
  },
  '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
    backgroundColor: "rgb(237, 247, 237)",
  },
  "& .MuiAutocomplete-option.Mui-focused": {
    backgroundColor: "rgb(237, 247, 237)",
  },
});

interface AutoCompleteRules {
  required?: string;
}

interface SelectFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  label?: string;
  size?: "small" | "medium";
  rules?: AutoCompleteRules;
  error?: string;
  options: { id: string; label: string }[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  withLabel?: boolean;
  sx?: SxProps;
}

const AutoCompleteItem: FC<SelectFieldProps> = ({
  name,
  control,
  label,
  size,
  rules = {},
  error,
  options,
  isLoading = false,
  disabled = false,
  withLabel = true,
  sx,
}) => {
  const { required = "" } = rules;
  const router = useRouter();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const labelProps = withLabel ? { label } : null;
        return (
          <Box sx={sx}>
            <FormControl fullWidth variant="outlined" error={!!error} size={size}>
              <Autocomplete
                {...field}
                {...labelProps}
                data-testid={`testid.form.autocompleteField.${field.name}`}
                disabled={disabled}
                id="grouped-demo"
                options={options || []}
                groupBy={(option) => option.groupBy}
                getOptionLabel={(option) => {
                  return option.label;
                }}
                onChange={(event, item) => {
                  field.onChange(item);
                }}
                isOptionEqualToValue={(option, value) => {
                  return option.id === value.id;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    size={size}
                    required={!!required}
                    error={!!error}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: isLoading && (
                        <InputAdornment position="end">
                          <CircularProgress color="secondary" size={16} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                renderGroup={(params) => (
                  <li key={params.key}>
                    <GroupHeader>{params.group}</GroupHeader>
                    <GroupItems>{params.children}</GroupItems>
                  </li>
                )}
                PaperComponent={({ children }) => {
                  return (
                    <Paper>
                      {children}
                      <Button
                        color="primary"
                        fullWidth
                        sx={{ justifyContent: "flex-start", pl: 2 }}
                        onMouseDown={() => {
                          router.push("/items/new");
                        }}
                      >
                        + Add New
                      </Button>
                    </Paper>
                  );
                }}
              />
              {withLabel && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </Box>
        );
      }}
    />
  );
};

export default AutoCompleteItem;
