import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import CommentItem from "../CommentItem";

describe("CommentItem", () => {
  const comment = {
    id: 1,
    content: "Great review!",
    user_name: "John Doe",
  };

  it("renders comment text", () => {
    render(<CommentItem comment={comment} />);
    const commentText = screen.getByTestId("testid.comment.content.1");
    expect(commentText).toBeInTheDocument();
  });

  it("renders comment author", () => {
    render(<CommentItem comment={comment} />);
    const commentAuthor = screen.getByTestId("testid.comment.author.1");
    expect(commentAuthor).toBeInTheDocument();
  });
});
