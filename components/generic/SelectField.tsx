import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { FC } from "react";
import { Controller } from "react-hook-form";

interface SelectFieldRules {
  required?: string;
}

interface SelectFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  size?: "small" | "medium";
  error?: string;
  rules?: SelectFieldRules;
  options: { value: string; label: string }[];
  disabled?: boolean;
  isLoading?: boolean;
}

const SelectField: FC<SelectFieldProps> = ({
  name,
  control,
  label,
  size,
  rules = {},
  error,
  options,
  isLoading = false,
  disabled = false,
}) => {
  const { required = "" } = rules;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Box mb={2}>
            <FormControl fullWidth variant="outlined" error={!!error} size={size}>
              <InputLabel id="a-label-id">{label}</InputLabel>
              <Select
                {...field}
                label={label}
                labelId="a-label-id"
                disabled={disabled}
                required={!!required}
                fullWidth
                variant="outlined"
                error={!!error}
              >
                <MenuItem value="" disabled>
                  {isLoading ? "Loading..." : "Select an option"}
                </MenuItem>
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error}</FormHelperText>
            </FormControl>
          </Box>
        );
      }}
    />
  );
};

export default SelectField;
