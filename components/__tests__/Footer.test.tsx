import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Footer from "../Footer";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("Footer component", () => {
  it("renders correctly", () => {
    render(<Footer />);
    const footerElement = screen.getByTestId("testid.footer");
    expect(footerElement).toBeInTheDocument();
  });

  it("displays the current year", () => {
    const { getByText } = render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(getByText(`© ${currentYear}`)).toBeInTheDocument();
  });

  it("displays the version number", () => {
    process.env.NEXT_PUBLIC_BUILD_TIMESTAMP = "2024-05-13T12:00:00Z"; // Mocking the version number
    const { getByText } = render(<Footer />);
    expect(getByText("2024-05-13T12:00:00Z")).toBeInTheDocument();
  });
});
