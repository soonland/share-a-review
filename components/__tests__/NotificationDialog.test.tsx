import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mutate } from "swr";

import NotificationDialog from "../notifications/NotificationDialog";

jest.mock("swr");

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string, params?: { value: string }) => {
    if (key === "notifications.modal.from" && params?.value) {
      return `From: ${params.value}`;
    }
    if (key === "notifications.modal.sentAt" && params?.value) {
      return `Sent at: ${params.value}`;
    }
    return key;
  },
}));

describe("NotificationDialog", () => {
  const mockNotification = {
    id: 1,
    title: "Test Notification",
    message: "Test Message Content",
    status: "unread",
    folder_id: 1,
    sender_name: "John Doe",
    sent_at: "2024-03-01T12:00:00Z",
  };

  const mockFolders = [
    { id: 1, name: "Inbox" },
    { id: 2, name: "Trash" },
    { id: 3, name: "Custom Folder" },
  ];

  const mockProps = {
    notification: mockNotification,
    openDialog: true,
    onClose: jest.fn(),
    setSelectedNotification: jest.fn(),
    folders: mockFolders,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe("UI/UX", () => {
    it("should render the dialog with notification details", () => {
      render(<NotificationDialog {...mockProps} />);

      // Verify title is displayed
      expect(screen.getByText(mockNotification.title)).toBeInTheDocument();

      // Verify message content is displayed
      expect(screen.getByText(mockNotification.message)).toBeInTheDocument();

      // Verify sender information is displayed
      expect(screen.getByText("From: John Doe")).toBeInTheDocument();

      // Verify timestamp is displayed
      expect(screen.getByText("Sent at: 2024-03-01T12:00:00Z")).toBeInTheDocument();
    });

    it("should not render when openDialog is false", () => {
      render(<NotificationDialog {...mockProps} openDialog={false} />);

      expect(screen.queryByText(mockNotification.title)).not.toBeInTheDocument();
    });
  });

  describe("user interactions", () => {
    it("should handle close button click", async () => {
      render(<NotificationDialog {...mockProps} />);

      const closeButton = screen.getByTestId("CloseIcon");
      await userEvent.click(closeButton);

      expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("should open menu on more options click", async () => {
      render(<NotificationDialog {...mockProps} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      // Verify menu items are displayed
      expect(screen.getByText("notifications.actions.delete")).toBeInTheDocument();
      expect(screen.getByText("notifications.actions.markAsRead")).toBeInTheDocument();
    });

    it("should handle mark as read action", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationDialog {...mockProps} />);

      // Open menu and click mark as read
      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      const markAsReadOption = screen.getByText("notifications.actions.markAsRead");
      await userEvent.click(markAsReadOption);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "read" }),
        }),
      );

      // Verify state update callback
      expect(mockProps.setSelectedNotification).toHaveBeenCalled();
      // Get the callback that was passed
      const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
      // Call the callback with the previous state and verify the result
      const result = updateCallback({ ...mockNotification });
      expect(result).toEqual(
        expect.objectContaining({
          status: "read",
        }),
      );
    });

    it("should handle marking as unread", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationDialog {...mockProps} notification={{ ...mockNotification, status: "read" }} />);

      // Open menu and click mark as unread
      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      const markAsUnreadOption = screen.getByText("notifications.actions.markAsUnread");
      await userEvent.click(markAsUnreadOption);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "unread" }),
        }),
      );

      // Verify state update callback
      expect(mockProps.setSelectedNotification).toHaveBeenCalled();
      // Get the callback that was passed
      const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
      // Call the callback with the previous state and verify the result
      const result = updateCallback({ ...mockNotification, status: "read" });
      expect(result).toEqual(
        expect.objectContaining({
          status: "unread",
        }),
      );
    });

    it("should handle restoring from trash", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      const trashNotification = {
        ...mockNotification,
        folder_id: mockFolders.find((f) => f.name === "Trash")?.id,
      };

      render(<NotificationDialog {...mockProps} notification={trashNotification} />);

      // Open menu and click restore
      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      const restoreOption = screen.getByText("notifications.actions.restore");
      await userEvent.click(restoreOption);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            folder_id: mockFolders.find((f) => f.name === "Inbox")?.id,
          }),
        }),
      );
    });

    it("should handle reply action click", async () => {
      render(<NotificationDialog {...mockProps} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      const replyOption = screen.getByText("notifications.actions.reply");

      // Verify reply option exists
      expect(replyOption).toBeInTheDocument();
    });

    it("should handle moving to different folder", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationDialog {...mockProps} />);

      // Open menu and click move to custom folder
      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      const moveToCustomFolder = screen.getByText("notifications.actions.moveTo", { exact: false });
      await userEvent.click(moveToCustomFolder);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: expect.stringContaining("folder_id"),
        }),
      );

      // Verify SWR cache is updated
      expect(mutate).toHaveBeenCalledWith("/api/notifications");
    });

    it("should update state even with API errors", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
      try {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
          }),
        ) as jest.Mock;

        render(<NotificationDialog {...mockProps} />);

        // Try to mark as read
        const moreOptionsButton = screen.getByTestId("MoreVertIcon");
        await userEvent.click(moreOptionsButton);
        const markAsReadOption = screen.getByText("notifications.actions.markAsRead");
        await userEvent.click(markAsReadOption);

        // Verify API call was attempted
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/notifications/${mockNotification.id}`,
          expect.objectContaining({
            method: "PATCH",
            body: JSON.stringify({ status: "read" }),
          }),
        );

        // State is still updated because component doesn't check response status
        expect(mockProps.setSelectedNotification).toHaveBeenCalled();
        const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
        const result = updateCallback({ ...mockNotification });
        expect(result).toEqual(expect.objectContaining({ status: "read" }));
      } finally {
        consoleError.mockRestore();
      }
    });
  });

  describe("menu positioning", () => {
    it("should position menu correctly", async () => {
      render(<NotificationDialog {...mockProps} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      const menu = screen.getByRole("menu").closest(".MuiPopover-paper");
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass("MuiPopover-paper");
    });

    it("should render different menu items based on notification state", async () => {
      // Test with unread notification
      render(<NotificationDialog {...mockProps} />);
      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      expect(screen.getByText("notifications.actions.markAsRead")).toBeInTheDocument();
      expect(screen.queryByText("notifications.actions.markAsUnread")).not.toBeInTheDocument();

      cleanup();

      // Test with read notification
      render(<NotificationDialog {...mockProps} notification={{ ...mockNotification, status: "read" }} />);
      const readMoreButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(readMoreButton);

      expect(screen.queryByText("notifications.actions.markAsRead")).not.toBeInTheDocument();
      expect(screen.getByText("notifications.actions.markAsUnread")).toBeInTheDocument();
    });

    it("should show moveToInbox only when not in inbox", async () => {
      const customFolderNotification = {
        ...mockNotification,
        folder_id: mockFolders.find((f) => f.name === "Custom Folder")?.id,
      };

      render(<NotificationDialog {...mockProps} notification={customFolderNotification} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      expect(screen.getByText("notifications.actions.moveToInbox")).toBeInTheDocument();
    });
  });

  describe("dialog styling", () => {
    it("should render with correct dimensions", async () => {
      render(<NotificationDialog {...mockProps} />);

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("MuiDialog-paper", "MuiDialog-paperFullWidth", "MuiDialog-paperWidthSm");
    });

    it("should render message with pre-wrap whitespace", () => {
      const multilineMessage = "Line 1\nLine 2\nLine 3";
      render(<NotificationDialog {...mockProps} notification={{ ...mockNotification, message: multilineMessage }} />);

      // In React, newlines in text content are preserved but normalized in the DOM
      const messageElement = screen.getByText((content) => content.includes("Line 1"));
      expect(messageElement).toHaveStyle({ whiteSpace: "pre-wrap" });
      expect(messageElement.textContent).toBe(multilineMessage);
    });
  });

  describe("navigation", () => {
    it("should render navigation buttons", () => {
      render(<NotificationDialog {...mockProps} />);

      // Verify all navigation buttons are present
      expect(screen.getByTestId("KeyboardDoubleArrowLeftIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardArrowLeftIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardArrowRightIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardDoubleArrowRightIcon")).toBeInTheDocument();
    });

    it("should interact with navigation buttons", async () => {
      render(<NotificationDialog {...mockProps} />);

      // Click all navigation buttons to ensure they're interactive
      await userEvent.click(screen.getByTestId("KeyboardDoubleArrowLeftIcon"));
      await userEvent.click(screen.getByTestId("KeyboardArrowLeftIcon"));
      await userEvent.click(screen.getByTestId("KeyboardArrowRightIcon"));
      await userEvent.click(screen.getByTestId("KeyboardDoubleArrowRightIcon"));
    });
  });

  describe("menu operations", () => {
    it("should close menu when clicking away", async () => {
      render(<NotificationDialog {...mockProps} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      const backdrop = screen.getByRole("presentation").firstChild as HTMLElement;
      await userEvent.click(backdrop);

      // Wait for menu transition
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should handle deleting notification", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationDialog {...mockProps} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      const deleteOption = screen.getByText("notifications.actions.delete");
      await userEvent.click(deleteOption);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            folder_id: mockFolders.find((f) => f.name === "Trash")?.id,
          }),
        }),
      );
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
      try {
        // Setup mock with failed response
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
          }),
        ) as jest.Mock;

        render(<NotificationDialog {...mockProps} />);

        // Try to mark as read
        const moreOptionsButton = screen.getByTestId("MoreVertIcon");
        await userEvent.click(moreOptionsButton);
        const markAsReadOption = screen.getByText("notifications.actions.markAsRead");
        await userEvent.click(markAsReadOption);

        // Verify API call was attempted
        expect(global.fetch).toHaveBeenCalledWith(
          `/api/notifications/${mockNotification.id}`,
          expect.objectContaining({
            method: "PATCH",
            body: JSON.stringify({ status: "read" }),
          }),
        );

        // State is still updated even with error
        expect(mockProps.setSelectedNotification).toHaveBeenCalled();
        const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
        const result = updateCallback({ ...mockNotification });
        expect(result).toEqual(expect.objectContaining({ status: "read" }));
      } finally {
        consoleError.mockRestore();
      }
    });
  });

  describe("edge cases", () => {
    it("should handle undefined notification", () => {
      render(<NotificationDialog {...mockProps} notification={undefined} />);
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });

    it("should handle empty folders array", () => {
      render(<NotificationDialog {...mockProps} folders={[]} />);
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });

    it("should handle folders without Inbox/Trash", async () => {
      const customFolders = [{ id: 3, name: "Custom Folder" }];
      render(<NotificationDialog {...mockProps} folders={customFolders} />);

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      expect(screen.getByText("notifications.actions.markAsRead")).toBeInTheDocument();
    });

    it("should handle dialog close via ESC key", async () => {
      render(<NotificationDialog {...mockProps} />);
      await userEvent.keyboard("{Escape}");
      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it("should handle dialog close via backdrop click", async () => {
      render(<NotificationDialog {...mockProps} />);

      const backdrop = document.querySelector(".MuiBackdrop-root") as HTMLElement;
      await userEvent.click(backdrop);

      expect(mockProps.onClose).toHaveBeenCalled();
    });

    it("should handle custom folder operations", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      const customFolders = [
        { id: 1, name: "Inbox" },
        { id: 2, name: "Trash" },
        { id: 3, name: "Custom Folder 1" },
        { id: 4, name: "Custom Folder 2" },
      ];

      render(
        <NotificationDialog
          {...mockProps}
          folders={customFolders}
          notification={{ ...mockNotification, folder_id: 3 }}
        />,
      );

      const moreOptionsButton = screen.getByTestId("MoreVertIcon");
      await userEvent.click(moreOptionsButton);

      // Use getAllByText since there could be multiple "moveTo" menu items
      const moveToItems = screen.getAllByText((content) => content.startsWith("notifications.actions.moveTo"));
      expect(moveToItems.length).toBeGreaterThan(0);
    });
  });
});
