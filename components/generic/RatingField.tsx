import { Star } from "@mui/icons-material";
import { Box, Rating } from "@mui/material";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";

interface RatingFieldRules {
  required?: string;
}

interface RatingFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  label: string;
  size?: "small" | "medium";
  error?: string;
  rules?: RatingFieldRules;
  multiline?: boolean;
  disabled?: boolean;
}

const labels: { [index: string]: string } = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const RatingField: FC<RatingFieldProps> = ({ name, control, size, disabled = false }) => {
  const [hover, setHover] = useState(-1);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Box mb={2}>
            <Rating
              name={name}
              value={Number(field.value)}
              disabled={disabled}
              size={size}
              getLabelText={getLabelText}
              onChange={field.onChange}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {Number(field.value) !== null && (
              <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : Number(field.value)]}</Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default RatingField;
