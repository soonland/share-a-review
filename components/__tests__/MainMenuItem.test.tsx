import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
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

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
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

    expect(useSWR).toHaveBeenCalledTimes(1);
  });
});
