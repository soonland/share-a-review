import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import MainMenuItem from "../MainMenuItem";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: {
      data: [],
    },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("MainMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a MainMenu", async () => {
    render(
      <MainMenuItem
        id={"reviewsMenu"}
        title={"mainMenu.reviews.title"}
        icon={"reviews"}
        subMenus={[
          { id: "allReviews", title: "All Reviews", url: "/reviews" },
          { id: "movies", title: "Movies", url: "/reviews/movies" },
        ]}
      />,
    );
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toBeInTheDocument();
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toHaveTextContent("mainMenu.reviews.title (0)");
  });

  [[], null, undefined].forEach((data) => {
    it(`renders a MainMenu with data: ${data}`, async () => {
      (useSWR as jest.Mock).mockReturnValue({
        data: { data },
      });

      render(
        <MainMenuItem
          id={"reviewsMenu"}
          title={"mainMenu.reviews.title"}
          icon={"reviews"}
          subMenus={[
            { id: "allReviews", title: "All Reviews", url: "/reviews" },
            { id: "movies", title: "Movies", url: "/reviews/movies" },
          ]}
        />,
      );
      expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toBeInTheDocument();
      expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toHaveTextContent("mainMenu.reviews.title (0)");

      expect(useSWR).toHaveBeenCalledTimes(1);
    });
  });

  it("renders a MainMenu and clicks", async () => {
    const mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(<MainMenuItem id={"writeReview"} title={"mainMenu.reviews.title"} />);

    const menu = screen.getByTestId("testid.mainMenu.writeReview");
    await userEvent.click(menu);
    expect(screen.getByTestId("testid.mainMenu.writeReview")).toBeInTheDocument();
    expect(screen.getByTestId("testid.mainMenu.writeReview")).toHaveTextContent("mainMenu.reviews.title");

    expect(mockRouter.push).toHaveBeenCalledTimes(1);
  });
});
