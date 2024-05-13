import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import Search from "../Search";
jest.mock("next-auth/react");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Search", () => {
  it("renders a Search", async () => {
    const mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(<Search />);

    await userEvent.type(screen.getByTestId("testid.search"), "test");
    await userEvent.keyboard("{Enter}");
    expect(mockRouter.push).toHaveBeenCalledWith("/?q=test");

    await userEvent.click(screen.getByTestId("testid.searchType"));
    await userEvent.click(screen.getByTestId("testid.search.searchAlbum"));
    await userEvent.clear(screen.getByTestId("testid.search").getElementsByTagName("input")[0]);
    await userEvent.type(screen.getByTestId("testid.search"), "test");
    await userEvent.keyboard("{Enter}");
    expect(mockRouter.push).toHaveBeenCalledWith("/?q=test&type=album");
    await userEvent.clear(screen.getByTestId("testid.search").getElementsByTagName("input")[0]);
    await userEvent.keyboard("{Enter}");
    expect(mockRouter.push).toHaveBeenCalledTimes(2);
  });
});
