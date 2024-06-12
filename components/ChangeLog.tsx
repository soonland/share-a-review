import { styled } from "@mui/material";
import { FC } from "react";

import { Change } from "@/models/types";

import ChangeLogItem from "./ChangeLogItem";

const ChangeLog: FC = () => {
  const changes: Change[] = [
    {
      version: "0.0.1",
      date: "2024-05-11",
      features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
    },
  ];

  const StyledH2 = styled("h2")(({ theme }) => ({
    fontSize: "2rem",
    margin: "0",
    borderBottom: "2px solid",
    borderBottomColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  }));

  return (
    <div>
      <StyledH2>Change Log</StyledH2>
      {changes
        .slice()
        .sort((a, b) => a.version.localeCompare(b.version))
        .reverse()
        .map((change, index) => {
          const k = `change-${index}`;
          return <ChangeLogItem key={k} change={change} />;
        })}
    </div>
  );
};

export default ChangeLog;
