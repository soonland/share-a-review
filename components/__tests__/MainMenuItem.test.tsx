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
          { id: "allReviews", title: "All Reviews" },
          { id: "movies", title: "Movies" },
          { id: "books", title: "Books" },
          { id: "music", title: "Music" },
          { id: "games", title: "Games" },
          { id: "products", title: "Products" },
          { id: "places", title: "Places" },
          { id: "restaurants", title: "Restaurants" },
          { id: "recipes", title: "Recipes" },
          { id: "videos", title: "Videos" },
          { id: "apps", title: "Apps" },
          { id: "services", title: "Services" },
          { id: "events", title: "Events" },
          { id: "other", title: "Other" },
        ]}
      />,
    );
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toBeInTheDocument();
    expect(screen.getByTestId("testid.mainMenu.reviewsMenu")).toHaveTextContent("mainMenu.reviews.title (0)");

    expect(useSWR).toHaveBeenCalledTimes(1);
  });
});
