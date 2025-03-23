import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotificationsPanel from "../notifications/NotificationsPanel";

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string) => key,
}));

describe("NotificationsPanel", () => {
  const mockNotifications = [
    {
      id: 1,
      title: "Unread Notification",
      message: "Test Message 1",
      status: "unread",
      folder: "inbox",
      type: "user",
      sent_at: "2024-03-01T12:00:00Z",
    },
    {
      id: 2,
      title: "Read Notification",
      message: "Test Message 2",
      status: "read",
      folder: "inbox",
      type: "system",
      sent_at: "2024-03-01T11:00:00Z",
    },
  ];

  const mockFolders = [
    { id: 1, name: "Inbox", type: "system" },
    { id: 2, name: "Custom Folder", type: "user" },
    { id: 3, name: "Trash", type: "system" },
  ];

  const mockProps = {
    notifications: mockNotifications,
    folders: mockFolders,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("rendering", () => {
    it("should render notifications panel with sidebar and content", () => {
      render(<NotificationsPanel {...mockProps} />);

      expect(screen.getByText("notifications.title")).toBeInTheDocument();
      expect(screen.getByText("notifications.sidebar.all")).toBeInTheDocument();
      expect(screen.getByText("notifications.unread")).toBeInTheDocument();
      expect(screen.getByText("notifications.read")).toBeInTheDocument();
    });

    it("should display notifications grouped by read status", () => {
      render(<NotificationsPanel {...mockProps} />);

      // Check unread section
      const unreadContainer = screen.getByText("notifications.unread").parentElement;
      expect(unreadContainer).toHaveTextContent("Unread Notification");

      // Check read section
      const readContainer = screen.getByText("notifications.read").parentElement;
      expect(readContainer).toHaveTextContent("Read Notification");
    });

    it("should render custom folders in sidebar", () => {
      render(<NotificationsPanel {...mockProps} />);

      expect(screen.getByText("Custom Folder")).toBeInTheDocument();
    });
  });

  describe("user interactions", () => {
    it("should filter notifications by type", async () => {
      render(<NotificationsPanel {...mockProps} />);

      // Click user notifications filter
      const userFilter = screen.getByText("notifications.sidebar.user");
      await userEvent.click(userFilter);

      // Only user notification should be visible
      expect(screen.getByText("Unread Notification")).toBeInTheDocument();
      expect(screen.queryByText("Read Notification")).not.toBeInTheDocument();
    });

    it("should handle search functionality", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const searchInput = screen.getByRole("textbox", { name: "notifications.search" });
      await userEvent.type(searchInput, "Unread");

      // Only matching notification should be visible
      expect(screen.getByText("Unread Notification")).toBeInTheDocument();
      expect(screen.queryByText("Read Notification")).not.toBeInTheDocument();
    });

    it("should handle bulk selection", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const selectAllButton = screen.getByText("notifications.selectAll");
      await userEvent.click(selectAllButton);

      // All checkboxes should be checked
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });

      // Click again to deselect
      await userEvent.click(selectAllButton);
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("should toggle sidebar collapse", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const collapseButton = screen.getByTestId("ChevronLeftIcon");
      await userEvent.click(collapseButton);

      // Verify sidebar is collapsed
      const sidebar = screen.getByTestId("testid.notificationsPanel.sidebar");
      expect(sidebar).toHaveStyle({ width: "80px" });

      // Click again to expand
      await userEvent.click(collapseButton);
      expect(sidebar).toHaveStyle({ width: "80px" });
    });

    it("should open NotificationDialog when clicking a notification", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const notification = screen.getByText("Unread Notification");
      await userEvent.click(notification);

      // Verify dialog is opened
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.unread")).toBeInTheDocument();
    });

    it("should open FolderDialog when clicking add folder", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const addFolderButton = screen.getByTestId("AddIcon");
      await userEvent.click(addFolderButton);

      // Verify dialog is opened
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.creation.title")).toBeInTheDocument();
    });
  });

  describe("folder management", () => {
    it("should show folder options only on hover", async () => {
      render(<NotificationsPanel {...mockProps} />);
      const user = userEvent.setup();

      // Initially, options button should be hidden
      const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
      if (!optionsButton) throw new Error("Options button not found");
      expect(optionsButton).toHaveClass("options-button");
      expect(optionsButton).not.toHaveClass("force-visible");

      // Hover over the folder to show options
      const folderContainer = screen.getByRole("button", { name: /Custom Folder/i }).parentElement;
      if (!folderContainer) throw new Error("Folder container not found");
      await user.hover(folderContainer);

      // Options button should become visible
      expect(optionsButton).toHaveClass("force-visible");

      // Mouse leave should hide the options
      await user.unhover(folderContainer);
      expect(optionsButton).not.toHaveClass("force-visible");
    });

    it("should handle folder deletion after hover", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationsPanel {...mockProps} />);
      const user = userEvent.setup();

      // Find and hover over the folder container
      const folderButton = screen.getByRole("button", { name: /Custom Folder/i });
      await user.hover(folderButton);

      // Open folder menu using the options button
      const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
      if (!optionsButton) throw new Error("Options button not found");
      await user.click(optionsButton);

      // Find and click delete option in the menu
      const deleteMenuItem = screen.getByRole("menuitem", {
        name: /notifications\.actions\.delete/i,
      });
      await user.click(deleteMenuItem);

      // Give time for the async operation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify API call and successful mutation
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/notificationsfolders\/\d+/),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should handle folder rename after hover", async () => {
      render(<NotificationsPanel {...mockProps} />);
      const user = userEvent.setup();

      // Find and hover over the folder container
      const folderButton = screen.getByRole("button", { name: /Custom Folder/i });
      await user.hover(folderButton);

      // Open folder menu using the options button
      const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
      if (!optionsButton) throw new Error("Options button not found");
      await user.click(optionsButton);

      // Click rename option in the menu
      const renameMenuItem = screen.getByRole("menuitem", {
        name: /notifications\.actions\.rename/i,
      });
      await user.click(renameMenuItem);

      // Give time for the async operation to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Verify rename dialog is opened and correct folder is selected
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.rename.title")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should handle API errors gracefully", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        }),
      ) as jest.Mock;

      render(<NotificationsPanel {...mockProps} />);
      const user = userEvent.setup();

      // Find and hover over the folder container
      const folderButton = screen.getByRole("button", { name: /Custom Folder/i });
      await user.hover(folderButton);

      // Open folder menu using the options button
      const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
      if (!optionsButton) throw new Error("Options button not found");
      await user.click(optionsButton);

      // Find and click delete option in the menu
      const deleteMenuItem = screen.getByRole("menuitem", {
        name: /notifications\.actions\.delete/i,
      });
      await user.click(deleteMenuItem);

      // Give time for the async operation and error handling to complete
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should not crash and handle error gracefully
      expect(screen.getByText("Custom Folder")).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting folder:",
        new Error("Failed to delete folder: 500 Internal Server Error"),
      );
    });
  });
});
