import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import React from "react";

import Changelog from "../ChangeLog";

describe("Changelog", () => {
  it("renders without crashing", () => {
    render(<Changelog />);
  });

  it("displays the correct title", () => {
    const { getByText } = render(<Changelog />);
    const titleElement = getByText("Change Log");
    expect(titleElement).toBeInTheDocument();
  });

  it("displays the correct number of entries", () => {
    const { getByTestId } = render(<Changelog />);
    const entryElement = getByTestId("testid.changeLog.2024-05-11");
    expect(entryElement).toBeInTheDocument();
  });
});
