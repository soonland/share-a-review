import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";

import ReviewItem from "../ReviewItem";

describe("ReviewItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the ProfileCard component with the correct props", () => {
    const review = { id: 1, name: "John Doe", review_content: "This is a review" };
    render(<ReviewItem review={review} />);

    const profileCardElement = screen.getByTestId(`testid.reviews.reviewItem.${review.id}.profileCard`);
    expect(profileCardElement).toBeInTheDocument();

    const profileCardNameElement = screen.getByTestId(`testid.reviews.reviewItem.${review.id}.profileCard.name`);
    expect(profileCardNameElement).toBeInTheDocument();

    const reviewElement = screen.getByTestId(`testid.reviews.reviewItem.${review.id}.review`);
    expect(reviewElement).toBeInTheDocument();
    expect(reviewElement).toHaveTextContent(review.review_content);
  });
});
