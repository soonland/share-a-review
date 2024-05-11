import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Footer from "../Footer";

jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe("Footer", () => {
  it("renders a Footer", async () => {
    render(<Footer />);

    const footer = screen.getByTestId("testid.footer");
    expect(footer).toBeInTheDocument();
  });
});
