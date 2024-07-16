import { Box, TextField } from "@mui/material";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";

interface InputFieldRules {
  required?: string;
  maxLength?: number;
}

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
