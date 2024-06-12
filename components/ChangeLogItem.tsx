import { styled } from "@mui/material";
import { FC } from "react";

import { Change } from "@/models/types";

const StyledChangeLogItem = styled("div")(({ theme }) => ({
  "& h3": {
    color: theme.palette.primary.dark,
    fontSize: "1.5rem",
    margin: "0",
    borderBottom: "1px solid",
    borderBottomColor: theme.palette.primary.dark,
    paddingTop: "0.5rem",
  },
  "& h4.features::before": {
    content: '"🚀"',
    marginRight: "0.5rem",
  },
  "& h4.fixes::before": {
    content: '"🐛"',
    marginRight: "0.5rem",
  },
  "& h4.gears::before": {
    content: '"🔧"',
    marginRight: "0.5rem",
  },
  "& h4": {
    fontSize: "1.2rem",
    margin: "1rem",
  },
}));

const ChangeLogItem: FC<{ change: Change }> = ({ change }) => {
  return (
    <StyledChangeLogItem data-testid={`testid.changeLog.${change.date}`}>
      <h3>
        {change.version} ({change.date})
      </h3>
      <h4 className="features">Features</h4>
      <ul>
        {change.features?.length === undefined && <li>No features</li>}
        {change.features?.map((feature, index) => {
          const k = `feature-${index}`;
          return <li key={k}>{feature}</li>;
        })}
      </ul>
      <h4 className="fixes">Fixes</h4>
      <ul>
        {change.fixes?.length === undefined && <li>No fixes</li>}
        {change.fixes?.map((fix, index) => {
          const k = `fix-${index}`;
          return <li key={k}>{fix}</li>;
        })}
      </ul>
      <h4 className="gears">Project configuration</h4>
      <ul>
        {change.projectConfiguration?.length === undefined && <li>No project configuration</li>}
        {change.projectConfiguration?.map((config, index) => {
          const k = `config-${index}`;
          return <li key={k}>{config}</li>;
        })}
      </ul>
    </StyledChangeLogItem>
  );
};

export default ChangeLogItem;
