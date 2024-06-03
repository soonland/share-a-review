import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import Alert from "../Alert";

test("renders an error alert with the correct message", () => {
  const errorMessage = "Something went wrong!";
  const { getByText } = render(<Alert severity="error" message={errorMessage} />);
  const alertElement = getByText(errorMessage);
  expect(alertElement).toBeInTheDocument();
  expect(alertElement).toHaveClass("MuiAlert-message");
});

test("renders a warning alert with the correct message", () => {
  const warningMessage = "Please proceed with caution.";
  const { getByText } = render(<Alert severity="warning" message={warningMessage} />);
  const alertElement = getByText(warningMessage);
  expect(alertElement).toBeInTheDocument();
  expect(alertElement).toHaveClass("MuiAlert-message");
});

test("renders an info alert with the correct message", () => {
  const infoMessage = "Here's some important information.";
  const { getByText } = render(<Alert severity="info" message={infoMessage} />);
  const alertElement = getByText(infoMessage);
  expect(alertElement).toBeInTheDocument();
  expect(alertElement).toHaveClass("MuiAlert-message");
});

test("renders a success alert with the correct message", () => {
  const successMessage = "Action completed successfully!";
  const { getByText } = render(<Alert severity="success" message={successMessage} />);
  const alertElement = getByText(successMessage);
  expect(alertElement).toBeInTheDocument();
  expect(alertElement).toHaveClass("MuiAlert-message");
});
