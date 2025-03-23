import "@testing-library/jest-dom";
import { FolderOutlined as FolderIcon } from "@mui/icons-material";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SidebarButton } from "../notifications/SidebarNavigation";

describe("SidebarButton", () => {
  const defaultProps = {
    icon: FolderIcon,
    label: "Test Label",
    isSelected: false,
    isCollapsed: false,
    unreadCount: 0,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render button with label when not collapsed", () => {
      render(<SidebarButton {...defaultProps} />);

      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should not show label when collapsed", () => {
      render(<SidebarButton {...defaultProps} isCollapsed={true} />);

      expect(screen.queryByText("Test Label")).not.toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should show unread count badge when provided", () => {
      render(<SidebarButton {...defaultProps} unreadCount={5} />);

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should not show badge when unread count is 0", () => {
      render(<SidebarButton {...defaultProps} unreadCount={0} />);

      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("should apply selected styles when isSelected is true", () => {
      render(<SidebarButton {...defaultProps} isSelected={true} />);

      expect(screen.getByRole("button")).toHaveClass("selected");
    });
  });

  describe("user interactions", () => {
    it("should call onClick when clicked", async () => {
      const handleClick = jest.fn();
      render(<SidebarButton {...defaultProps} onClick={handleClick} />);

      await userEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle keyboard interactions", async () => {
      const handleClick = jest.fn();
      render(<SidebarButton {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();

      // Test Enter key
      await userEvent.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key
      await userEvent.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it("should show and handle options button when hovered", async () => {
      const handleOptionsClick = jest.fn();
      render(<SidebarButton {...defaultProps} showOptions={true} onOptionsClick={handleOptionsClick} />);

      const optionsButton = screen.getByTestId("MoreVertIcon").parentElement;
      expect(optionsButton).toBeInTheDocument();

      await userEvent.click(optionsButton!);
      expect(handleOptionsClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger parent onClick when clicking options", async () => {
      const handleClick = jest.fn();
      const handleOptionsClick = jest.fn();
      render(
        <SidebarButton
          {...defaultProps}
          onClick={handleClick}
          showOptions={true}
          onOptionsClick={handleOptionsClick}
        />,
      );

      const optionsButton = screen.getByTestId("MoreVertIcon").parentElement;
      await userEvent.click(optionsButton!);

      expect(handleOptionsClick).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
