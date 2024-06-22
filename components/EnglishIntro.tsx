import { Typography, Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const EnglishIntroduction = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Share-A-Review - The Voice of the Community!
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t("home.welcomeMessage")}
      </Typography>
      {/* <Typography variant="body1" paragraph>
        <strong>Why Join Our Community?</strong>
      </Typography>
      <Typography variant="body1" paragraph>
        - <strong>Express Yourself Freely</strong>: Share your honest and detailed opinions on products, movies,
        restaurants, and much more.
      </Typography>
      <Typography variant="body1" paragraph>
        - <strong>Influence Decisions</strong>: Help other community members make informed choices with your feedback
        and recommendations.
      </Typography>
      <Typography variant="body1" paragraph>
        - <strong>Gain Credibility</strong>: Become a go-to expert in your areas of interest by regularly publishing
        high-quality reviews.
      </Typography>
      <Typography variant="body1" paragraph>
        - <strong>Access Exclusive Content</strong>: Enjoy guides, comparisons, and sneak peeks reserved for our
        registered members.
      </Typography>
      <Typography variant="body1" paragraph>
        - <strong>Earn Rewards</strong>: Participate in our loyalty programs and contests to win gifts and special
        perks.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>How Does It Work?</strong>
      </Typography>
      <Typography variant="body1" paragraph>
        1. <strong>Sign Up in a Click</strong>: Joining our community is quick and free. Sign up now to start posting
        your reviews.
      </Typography>
      <Typography variant="body1" paragraph>
        2. <strong>Publish Your Reviews</strong>: Write detailed and unbiased reviews about your recent experiences.
      </Typography>
      <Typography variant="body1" paragraph>
        3. <strong>Engage with the Community</strong>: Comment, like, and share other members' reviews. The more you
        participate, the more influence you gain!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Join Share-A-Review Today!
      </Typography>
      <Typography variant="body1" paragraph>
        Don't miss this opportunity to make your voice heard and join a dynamic and passionate community.
      </Typography>
      <Button variant="contained" color="primary">
        Click here to sign up
      </Button> */}
    </Box>
  );
};

export default EnglishIntroduction;
