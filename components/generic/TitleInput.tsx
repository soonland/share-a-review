import { Box, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

const TitleInput = ({ name, control, label, size, error, withLabel = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box mb={2}>
          {withLabel && <label>{label}</label>}
          <TextField
            {...field}
            label={label}
            size={size}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error ?? ""}
          />
        </Box>
      )}
    />
  );
};

export default TitleInput;
