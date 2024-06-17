import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import CommentsSection from "../CommentsSection";

describe("CommentsSection", () => {
  const comments = [
    {
      id: 1,
      content: "Great review!",
      user_name: "John Doe",
    },
    {
      id: 2,
      content: "Nice job!",
      user_name: "Jane Smith",
    },
  ];

  it("renders the comments section with correct heading", () => {
    render(<CommentsSection comments={comments} />);
    const heading = screen.getByText("Comments (2)");
    expect(heading).toBeInTheDocument();
  });

  it("renders the comments when there are comments", () => {
    render(<CommentsSection comments={comments} />);
    for (const element of comments) {
      const commentItems = screen.getByTestId(`testid.comment.${element.id}`);
      expect(commentItems).toBeInTheDocument();
    }
  });

  it("renders a message when there are no comments", () => {
    render(<CommentsSection comments={[]} />);
    const message = screen.getByText("No comments! Be the first to comment. 🦄");
    expect(message).toBeInTheDocument();
  });
});
