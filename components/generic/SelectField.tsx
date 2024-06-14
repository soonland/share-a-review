import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SxProps } from "@mui/material";
import { FC } from "react";
import { Controller } from "react-hook-form";

interface SelectFieldRules {
  required?: string;
}

interface SelectFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label?: string;
  size?: "small" | "medium";
  error?: string;
  rules?: SelectFieldRules;
  options: { value: string; label: string }[];
  disabled?: boolean;
  withLabel?: boolean;
  isLoading?: boolean;
  sx?: SxProps;
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
                disabled={disabled}
                required={!!required}
                displayEmpty={!withLabel}
                fullWidth
                variant="outlined"
                error={!!error}
                placeholder="Select an option"
                onChange={field.onChange}
                // onChange={(e) => {
                //   field.onChange(e);
                //   if (onChange) {
                //     onChange(field.value);
                //   }
                // }}
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
              {withLabel && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
          </Box>
        );
      }}
    />
  );
};

export default SelectField;
