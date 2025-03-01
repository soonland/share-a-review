/**
 * @fileoverview A reusable select field component with form integration and validation
 */

import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SxProps } from "@mui/material";
import { FC } from "react";
import { Controller } from "react-hook-form";

/**
 * Validation rules for the select field
 * @interface SelectFieldRules
 */
interface SelectFieldRules {
  required?: string;
}

/**
 * Props interface for the SelectField component
 * @interface SelectFieldProps
 */
interface SelectFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  label?: string;
  size?: "small" | "medium";
  rules?: SelectFieldRules;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  withLabel?: boolean;
  sx?: SxProps;
}

/**
 * A form-integrated select field component with validation and accessibility features.
 *
 * Features:
 * - MUI Select integration
 * - react-hook-form compatibility
 * - Error handling and validation
 * - Optional label display
 * - Placeholder support
 * - Disabled state support
 *
 * @param {SelectFieldProps} props - Component props
 * @param {string} props.name - Field name for form registration
 * @param {any} [props.control] - react-hook-form control object
 * @param {string} [props.label] - Input label
 * @param {"small" | "medium"} [props.size] - Size variant of the field
 * @param {SelectFieldRules} [props.rules] - Validation rules
 * @param {string} [props.error] - Error message to display
 * @param {Array<{value: string, label: string}>} props.options - Select options
 * @param {string} [props.placeholder] - Placeholder text (defaults to label)
 * @param {boolean} [props.isLoading] - Loading state flag
 * @param {boolean} [props.disabled] - Disable the field
 * @param {boolean} [props.withLabel] - Show field label
 * @param {SxProps} [props.sx] - MUI system props for styling
 * @returns {JSX.Element} A select field with form integration and validation
 */
const SelectField: FC<SelectFieldProps> = ({
  name,
  control,
  label,
  size,
  rules = {},
  error,
  options,
  placeholder = label,
  disabled = false,
  withLabel = true,
  sx,
}) => {
  const { required = "" } = rules;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const labelProps = withLabel ? { label: label, labelId: "a-label-id" } : {};
        return (
          <Box sx={sx}>
            <FormControl fullWidth variant="outlined" error={!!error} size={size}>
              {withLabel && <InputLabel id="a-label-id">{label}</InputLabel>}
              <Select
                {...field}
                {...labelProps}
                data-testid={`testid.form.selectField.${field.name}`}
                disabled={disabled}
                required={!!required}
                displayEmpty={!withLabel}
                fullWidth
                variant="outlined"
                error={!!error}
                onChange={field.onChange}
              >
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {withLabel && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </Box>
        );
      }}
    />
  );
};

export default SelectField;
