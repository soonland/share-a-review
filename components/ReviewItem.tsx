import { Grid } from "@mui/material";

import ProfileCard from "./ProfileCard";
import Review from "./Review";

const ReviewItem = ({ review }) => {
  return (
    <Grid item container xs={12}>
      <Grid item xs={3}>
        <ProfileCard user={review} />
      </Grid>
      <Grid item xs={9}>
        <Review review={review} />
      </Grid>
    </Grid>
  );
};

export default ReviewItem;
