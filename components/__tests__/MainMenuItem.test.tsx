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
          { id: "books", title: "Books", url: "/reviews/books" },
          { id: "music", title: "Music", url: "/reviews/music" },
          { id: "games", title: "Games", url: "/reviews/games" },
          { id: "products", title: "Products", url: "/reviews/products" },
          { id: "places", title: "Places", url: "/reviews/places" },
          { id: "restaurants", title: "Restaurants", url: "/reviews/restaurants" },
          { id: "recipes", title: "Recipes", url: "/reviews/recipes" },
          { id: "videos", title: "Videos", url: "/reviews/videos" },
          { id: "apps", title: "Apps", url: "/reviews/apps" },
          { id: "services", title: "Services", url: "/reviews/services" },
          { id: "events", title: "Events", url: "/reviews/events" },
          { id: "other", title: "Other", url: "/reviews/other" },
        ]}
      />,
    );
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toBeInTheDocument();
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toHaveTextContent("mainMenu.reviews.title (0)");
  });

  it("renders a MainMenu without data", async () => {
    (useSWR as jest.Mock).mockReturnValue({
      data: { data: null },
    });

    render(
      <MainMenuItem
        id={"reviewsMenu"}
        title={"mainMenu.reviews.title"}
        icon={"reviews"}
        subMenus={[
          { id: "allReviews", title: "All Reviews", url: "/reviews" },
          { id: "movies", title: "Movies", url: "/reviews/movies" },
          { id: "books", title: "Books", url: "/reviews/books" },
          { id: "music", title: "Music", url: "/reviews/music" },
          { id: "games", title: "Games", url: "/reviews/games" },
          { id: "products", title: "Products", url: "/reviews/products" },
          { id: "places", title: "Places", url: "/reviews/places" },
          { id: "restaurants", title: "Restaurants", url: "/reviews/restaurants" },
          { id: "recipes", title: "Recipes", url: "/reviews/recipes" },
          { id: "videos", title: "Videos", url: "/reviews/videos" },
          { id: "apps", title: "Apps", url: "/reviews/apps" },
          { id: "services", title: "Services", url: "/reviews/services" },
          { id: "events", title: "Events", url: "/reviews/events" },
          { id: "other", title: "Other", url: "/reviews/other" },
        ]}
      />,
    );
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toBeInTheDocument();
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toHaveTextContent("mainMenu.reviews.title (0)");

    expect(useSWR).toHaveBeenCalledTimes(1);
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
