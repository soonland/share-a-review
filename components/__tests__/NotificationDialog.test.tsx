import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mutate } from "swr";

import NotificationDialog from "../notifications/NotificationDialog";

// Helper Functions
interface ApiResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
}

const setupApiMock = (response: ApiResponse = { ok: true }) => {
  global.fetch = jest.fn(() => Promise.resolve(response)) as jest.Mock;
};

const openMenu = async () => {
  const moreOptionsButton = screen.getByTestId("MoreVertIcon");
  await userEvent.click(moreOptionsButton);
};

const verifyApiCall = (endpoint: string, method: string, body: object) => {
  expect(global.fetch).toHaveBeenCalledWith(
    endpoint,
    expect.objectContaining({
      method,
      body: JSON.stringify(body),
    }),
  );
};

const createNotification = (overrides = {}) => ({
  id: 1,
  title: "Test Notification",
  message: "Test Message Content",
  status: "unread",
  folder_id: 1,
  sender_name: "John Doe",
  sent_at: "2024-03-01T12:00:00Z",
  ...overrides,
});

const createFolders = () => [
  { id: 1, name: "Inbox" },
  { id: 2, name: "Trash" },
  { id: 3, name: "Custom Folder" },
];

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
  const mockNotification = createNotification();
  const mockFolders = createFolders();
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

      expect(screen.getByText(mockNotification.title)).toBeInTheDocument();
      expect(screen.getByText(mockNotification.message)).toBeInTheDocument();
      expect(screen.getByText("From: John Doe")).toBeInTheDocument();
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
      await openMenu();
      expect(screen.getByText("notifications.actions.delete")).toBeInTheDocument();
      expect(screen.getByText("notifications.actions.markAsRead")).toBeInTheDocument();
    });

    it("should handle mark as read action", async () => {
      setupApiMock();
      render(<NotificationDialog {...mockProps} />);

      await openMenu();
      const markAsReadOption = screen.getByText("notifications.actions.markAsRead");
      await userEvent.click(markAsReadOption);

      verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", { status: "read" });

      expect(mockProps.setSelectedNotification).toHaveBeenCalled();
      const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
      const result = updateCallback({ ...mockNotification });
      expect(result).toEqual(expect.objectContaining({ status: "read" }));
    });

    it("should handle marking as unread", async () => {
      setupApiMock();
      const readNotification = createNotification({ status: "read" });
      render(<NotificationDialog {...mockProps} notification={readNotification} />);

      await openMenu();
      const markAsUnreadOption = screen.getByText("notifications.actions.markAsUnread");
      await userEvent.click(markAsUnreadOption);

      verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", { status: "unread" });

      expect(mockProps.setSelectedNotification).toHaveBeenCalled();
      const updateCallback = mockProps.setSelectedNotification.mock.calls[0][0];
      const result = updateCallback(readNotification);
      expect(result).toEqual(expect.objectContaining({ status: "unread" }));
    });

    it("should handle restoring from trash", async () => {
      setupApiMock();
      const trashNotification = createNotification({
        folder_id: mockFolders.find((f) => f.name === "Trash")?.id,
      });

      render(<NotificationDialog {...mockProps} notification={trashNotification} />);

      await openMenu();
      const restoreOption = screen.getByText("notifications.actions.restore");
      await userEvent.click(restoreOption);

      verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", {
        folder_id: mockFolders.find((f) => f.name === "Inbox")?.id,
      });
    });

    it("should handle reply action click", async () => {
      render(<NotificationDialog {...mockProps} />);
      await openMenu();
      const replyOption = screen.getByText("notifications.actions.reply");
      expect(replyOption).toBeInTheDocument();
    });

    it("should handle moving to different folder", async () => {
      setupApiMock();
      render(<NotificationDialog {...mockProps} />);

      await openMenu();
      const moveToCustomFolder = screen.getByText("notifications.actions.moveTo", { exact: false });
      await userEvent.click(moveToCustomFolder);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: expect.stringMatching(/folder_id/),
        }),
      );

      expect(mutate).toHaveBeenCalledWith("/api/notifications");
    });
  });

  describe("error handling", () => {
    it("should update state even with API errors", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
      try {
        setupApiMock({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });

        render(<NotificationDialog {...mockProps} />);

        await openMenu();
        const markAsReadOption = screen.getByText("notifications.actions.markAsRead");
        await userEvent.click(markAsReadOption);

        verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", { status: "read" });

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
      await openMenu();

      const menu = screen.getByRole("menu").closest(".MuiPopover-paper");
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass("MuiPopover-paper");
    });

    it("should render different menu items based on notification state", async () => {
      // Test with unread notification
      render(<NotificationDialog {...mockProps} />);
      await openMenu();
      expect(screen.getByText("notifications.actions.markAsRead")).toBeInTheDocument();
      expect(screen.queryByText("notifications.actions.markAsUnread")).not.toBeInTheDocument();

      cleanup();

      // Test with read notification
      const readNotification = createNotification({ status: "read" });
      render(<NotificationDialog {...mockProps} notification={readNotification} />);
      await openMenu();
      expect(screen.queryByText("notifications.actions.markAsRead")).not.toBeInTheDocument();
      expect(screen.getByText("notifications.actions.markAsUnread")).toBeInTheDocument();
    });

    it("should show moveToInbox only when not in inbox", async () => {
      const customFolderNotification = createNotification({
        folder_id: mockFolders.find((f) => f.name === "Custom Folder")?.id,
      });

      render(<NotificationDialog {...mockProps} notification={customFolderNotification} />);
      await openMenu();
      expect(screen.getByText("notifications.actions.moveToInbox")).toBeInTheDocument();
    });
  });

  describe("dialog styling", () => {
    it("should render with correct dimensions", () => {
      render(<NotificationDialog {...mockProps} />);
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("MuiDialog-paper", "MuiDialog-paperFullWidth", "MuiDialog-paperWidthSm");
    });

    it("should render message with pre-wrap whitespace", () => {
      const multilineMessage = "Line 1\nLine 2\nLine 3";
      render(<NotificationDialog {...mockProps} notification={createNotification({ message: multilineMessage })} />);

      const messageElement = screen.getByText((content) => content.includes("Line 1"));
      expect(messageElement).toHaveStyle({ whiteSpace: "pre-wrap" });
      expect(messageElement.textContent).toBe(multilineMessage);
    });
  });

  describe("navigation", () => {
    it("should render navigation buttons", () => {
      render(<NotificationDialog {...mockProps} />);

      expect(screen.getByTestId("KeyboardDoubleArrowLeftIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardArrowLeftIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardArrowRightIcon")).toBeInTheDocument();
      expect(screen.getByTestId("KeyboardDoubleArrowRightIcon")).toBeInTheDocument();
    });

    it("should interact with navigation buttons", async () => {
      render(<NotificationDialog {...mockProps} />);

      await userEvent.click(screen.getByTestId("KeyboardDoubleArrowLeftIcon"));
      await userEvent.click(screen.getByTestId("KeyboardArrowLeftIcon"));
      await userEvent.click(screen.getByTestId("KeyboardArrowRightIcon"));
      await userEvent.click(screen.getByTestId("KeyboardDoubleArrowRightIcon"));
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
      await openMenu();
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
      setupApiMock();
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
          notification={createNotification({ folder_id: 3 })}
        />,
      );

      await openMenu();
      const moveToItems = screen.getAllByText((content) => content.startsWith("notifications.actions.moveTo"));
      expect(moveToItems.length).toBeGreaterThan(0);
    });
  });
});
