/**
 * @fileoverview A reusable autocomplete component with grouping and custom styling
 */

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

/**
 * Styled component for group headers in the autocomplete dropdown.
 * Features sticky positioning and themed background color.
 */
const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  backgroundColor: darken(theme.palette.primary.main, 0.2),
}));

/**
 * Styled component for the group items list.
 * Customizes selection and hover states.
 */
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

/**
 * Validation rules for the autocomplete field
 */
interface AutoCompleteRules {
  required?: string;
}

/**
 * Props interface for the AutoCompleteItem component
 * @interface SelectFieldProps
 */
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

/**
 * A reusable autocomplete component that supports grouping, loading states,
 * and form integration with react-hook-form.
 *
 * Features:
 * - Grouped options with sticky headers
 * - Loading state indicator
 * - Form validation integration
 * - Custom styling for selected/focused states
 * - "Add New" button with navigation
 *
 * @param {SelectFieldProps} props - Component props
 * @param {string} props.name - Field name for form registration
 * @param {any} props.control - react-hook-form control object
 * @param {string} [props.label] - Input label
 * @param {"small" | "medium"} [props.size] - Size variant of the field
 * @param {AutoCompleteRules} [props.rules] - Validation rules
 * @param {string} [props.error] - Error message to display
 * @param {Array<{id: string, label: string}>} props.options - Autocomplete options
 * @param {boolean} [props.isLoading] - Show loading indicator
 * @param {boolean} [props.disabled] - Disable the field
 * @param {boolean} [props.withLabel] - Show field label
 * @param {SxProps} [props.sx] - MUI system props for styling
 * @returns {JSX.Element} An autocomplete field with grouping and custom styling
 */
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
                          router.push("/items/create");
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
