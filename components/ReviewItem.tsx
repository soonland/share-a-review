import { Grid } from "@mui/material";

import ProfileCard from "./ProfileCard";
import Review from "./Review";

/**
 * A component that displays a review with the reviewer's profile card and review content
 * in a grid layout.
 *
 * @param {Object} props - The component props
 * @param {Object} props.review - The review object containing user and review information
 * @returns {JSX.Element} A grid layout containing the profile card and review content
 */
const ReviewItem = ({ review }) => {
  return (
    <Grid container size={12}>
      <Grid>
        <ProfileCard user={review} />
      </Grid>
      <Grid>
        <Review review={review} />
      </Grid>
    </Grid>
  );
};

export default ReviewItem;
