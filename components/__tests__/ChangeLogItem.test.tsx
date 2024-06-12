import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";

import ChangeLogItem from "../ChangeLogItem";

describe("ChangeLogItem", () => {
  it("renders without crashing", () => {
    render(
      <ChangeLogItem
        change={{
          version: "0.0.1",
          date: "2024-05-11",
          features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
        }}
      />,
    );
  });

  it("displays the correct version and date", () => {
    const { getByText } = render(
      <ChangeLogItem
        change={{
          version: "0.0.1",
          date: "2024-05-11",
          features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
        }}
      />,
    );
    const versionElement = getByText("0.0.1 (2024-05-11)");
    expect(versionElement).toBeInTheDocument();
  });

  it("displays the correct number of features", () => {
    const { getByText } = render(
      <ChangeLogItem
        change={{
          version: "0.0.1",
          date: "2024-05-11",
          features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
        }}
      />,
    );
    const featureElement = getByText("Features");
    expect(featureElement).toBeInTheDocument();
    const featureList = getByText("Initial release");
    expect(featureList).toBeInTheDocument();
  });

  it("displays the correct number of fixes", () => {
    const { getByText } = render(
      <ChangeLogItem
        change={{
          version: "0.0.1",
          date: "2024-05-11",
          features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
          fixes: ["Fix 1", "Fix 2"],
        }}
      />,
    );
    const fixElement = getByText("Fixes");
    expect(fixElement).toBeInTheDocument();
    const fixList = getByText("Fix 1");
    expect(fixList).toBeInTheDocument();
  });

  it("displays the correct number of project configuration", () => {
    const { getByText } = render(
      <ChangeLogItem
        change={{
          version: "0.0.1",
          date: "2024-05-11",
          features: ["Initial release", "Next.js build", "MUI Components", "Demo mode"],
          fixes: ["Fix 1", "Fix 2"],
          projectConfiguration: ["Config 1", "Config 2"],
        }}
      />,
    );
    const configElement = getByText("Project configuration");
    expect(configElement).toBeInTheDocument();
    const configList = getByText("Config 1");
    expect(configList).toBeInTheDocument();
  });
});
