import { Box, TextField } from "@mui/material";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";

/**
 * Rules configuration for the input field validation
 * @interface InputFieldRules
 */
interface InputFieldRules {
  required?: string;
  maxLength?: number;
}

/**
 * Props interface for the InputField component
 * @interface InputFieldProps
 */
interface InputFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  label: string;
  size?: "small" | "medium";
  error?: string;
  rules?: InputFieldRules;
  multiline?: boolean;
  disabled?: boolean;
}

/**
 * A reusable form input field component that integrates with react-hook-form.
 * Provides text input functionality with validation, character counting, and error display.
 *
 * @example
 * ```tsx
 * <InputField
 *   name="description"
 *   control={control}
 *   label="Description"
 *   rules={{ required: "Description is required", maxLength: 200 }}
 *   multiline
 * />
 * ```
 *
 * @param {InputFieldProps} props - Component props
 * @param {string} props.name - Field name for form registration
 * @param {Control} props.control - react-hook-form Control object
 * @param {string} props.label - Input field label
 * @param {"small" | "medium"} [props.size] - Size variant of the input field
 * @param {string} [props.error] - Error message to display
 * @param {InputFieldRules} [props.rules] - Validation rules
 * @param {boolean} [props.multiline=false] - Whether to render as a multiline input
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @returns {JSX.Element} A form input field with validation and error handling
 */
const InputField: FC<InputFieldProps> = ({
  name,
  control,
  label,
  size,
  error,
  rules = {},
  multiline = false,
  disabled = false,
}) => {
  const { required = "", maxLength = 100 } = rules;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const helperText = error;
        return (
          <Box mb={2}>
            <TextField
              {...field}
              label={label}
              size={size}
              required={!!required}
              inputProps={{ maxLength }}
              disabled={disabled}
              multiline={multiline}
              rows={multiline ? 4 : 1}
              fullWidth
              variant="outlined"
              error={!!error}
              helperText={helperText ?? `${field?.value?.length ?? "0"}/${maxLength}`}
            />
          </Box>
        );
      }}
    />
  );
};

export default InputField;
