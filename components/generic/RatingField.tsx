/**
 * @fileoverview A reusable rating field component with hover labels and form integration
 */

import { Star } from "@mui/icons-material";
import { Box, Rating } from "@mui/material";
import { FC, useState } from "react";
import { Controller } from "react-hook-form";

/**
 * Props interface for the RatingField component
 * @interface RatingFieldProps
 */
interface RatingFieldProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  size?: "small" | "medium";
  disabled?: boolean;
}

/**
 * Text labels for different rating values
 * Each half-star increment has a corresponding descriptive label
 */
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

/**
 * Formats rating value into an accessible label text
 *
 * @param {number} value - The rating value
 * @returns {string} Formatted label including star count and description
 */
function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

/**
 * A form-integrated rating component with hover feedback and accessibility features.
 *
 * Features:
 * - Half-star precision
 * - Hover state descriptions
 * - react-hook-form integration
 * - Customizable size
 * - Accessible labels
 *
 * @param {RatingFieldProps} props - Component props
 * @param {string} props.name - Field name for form registration
 * @param {any} props.control - react-hook-form control object
 * @param {"small" | "medium"} [props.size] - Size variant of the rating stars
 * @param {boolean} [props.disabled=false] - Whether the rating is disabled
 * @returns {JSX.Element} A rating field with hover labels and form integration
 */
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
              max={5}
              defaultValue={3}
              size={size}
              getLabelText={getLabelText}
              onChange={field.onChange}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            {!!Number(field.value) && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : Number(field.value)]}</Box>}
          </Box>
        );
      }}
    />
  );
};

export default RatingField;
