import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotificationsPanel from "../notifications/NotificationsPanel";

// Helper Functions
interface ApiResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
}

const setupApiMock = (response: ApiResponse = { ok: true }) => {
  global.fetch = jest.fn(() => Promise.resolve(response)) as jest.Mock;
};

const createNotification = (overrides = {}) => ({
  id: 1,
  title: "Unread Notification",
  message: "Test Message 1",
  status: "unread",
  folder: "inbox",
  type: "user",
  sent_at: "2024-03-01T12:00:00Z",
  ...overrides,
});

const createFolder = (overrides = {}) => ({
  id: 1,
  name: "Custom Folder",
  type: "user",
  ...overrides,
});

const openFolderMenu = async (folderName: string) => {
  const user = userEvent.setup();
  const folderButton = screen.getByRole("button", { name: new RegExp(folderName, "i") });
  await user.hover(folderButton);
  const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
  if (!optionsButton) throw new Error("Options button not found");
  await user.click(optionsButton);
};

const clickMenuItem = async (name: string) => {
  const user = userEvent.setup();
  const menuItem = screen.getByRole("menuitem", { name: new RegExp(name, "i") });
  await user.click(menuItem);
};

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string) => key,
}));

describe("NotificationsPanel", () => {
  const mockNotifications = [
    createNotification(),
    createNotification({
      id: 2,
      title: "Read Notification",
      message: "Test Message 2",
      status: "read",
      type: "system",
      sent_at: "2024-03-01T11:00:00Z",
    }),
  ];

  const mockFolders = [
    createFolder({ id: 1, name: "Inbox", type: "system" }),
    createFolder({ id: 2, name: "Custom Folder" }),
    createFolder({ id: 3, name: "Trash", type: "system" }),
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

      const unreadContainer = screen.getByText("notifications.unread").parentElement;
      expect(unreadContainer).toHaveTextContent("Unread Notification");

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

      const userFilter = screen.getByText("notifications.sidebar.user");
      await userEvent.click(userFilter);

      expect(screen.getByText("Unread Notification")).toBeInTheDocument();
      expect(screen.queryByText("Read Notification")).not.toBeInTheDocument();
    });

    it("should handle search functionality", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const searchInput = screen.getByRole("textbox", { name: "notifications.search" });
      await userEvent.type(searchInput, "Unread");

      expect(screen.getByText("Unread Notification")).toBeInTheDocument();
      expect(screen.queryByText("Read Notification")).not.toBeInTheDocument();
    });

    it("should handle bulk selection", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const selectAllButton = screen.getByText("notifications.selectAll");
      await userEvent.click(selectAllButton);

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());

      await userEvent.click(selectAllButton);
      checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
    });

    it("should toggle sidebar collapse", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const collapseButton = screen.getByTestId("ChevronLeftIcon");
      await userEvent.click(collapseButton);

      const sidebar = screen.getByTestId("testid.notificationsPanel.sidebar");
      expect(sidebar).toHaveStyle({ width: "80px" });

      await userEvent.click(collapseButton);
      expect(sidebar).toHaveStyle({ width: "80px" });
    });

    it("should open NotificationDialog when clicking a notification", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const notification = screen.getByText("Unread Notification");
      await userEvent.click(notification);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.unread")).toBeInTheDocument();
    });

    it("should open FolderDialog when clicking add folder", async () => {
      render(<NotificationsPanel {...mockProps} />);

      const addFolderButton = screen.getByTestId("AddIcon");
      await userEvent.click(addFolderButton);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.creation.title")).toBeInTheDocument();
    });
  });

  describe("folder management", () => {
    it("should show folder options only on hover", async () => {
      setupApiMock();
      render(<NotificationsPanel {...mockProps} />);
      const user = userEvent.setup();

      const optionsButton = screen.getByTestId("MoreVertIcon").closest("button");
      if (!optionsButton) throw new Error("Options button not found");
      expect(optionsButton).toHaveClass("options-button");
      expect(optionsButton).not.toHaveClass("force-visible");

      const folderContainer = screen.getByRole("button", { name: /Custom Folder/i }).parentElement;
      if (!folderContainer) throw new Error("Folder container not found");
      await user.hover(folderContainer);

      expect(optionsButton).toHaveClass("force-visible");
      await user.unhover(folderContainer);
      expect(optionsButton).not.toHaveClass("force-visible");
    });

    it("should handle folder deletion after hover", async () => {
      setupApiMock();
      render(<NotificationsPanel {...mockProps} />);

      await openFolderMenu("Custom Folder");
      await clickMenuItem("notifications.actions.delete");

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/notificationsfolders\/\d+/),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should handle folder rename after hover", async () => {
      render(<NotificationsPanel {...mockProps} />);

      await openFolderMenu("Custom Folder");
      await clickMenuItem("notifications.actions.rename");

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.rename.title")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("should handle API errors gracefully", async () => {
      setupApiMock({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      render(<NotificationsPanel {...mockProps} />);

      await openFolderMenu("Custom Folder");
      await clickMenuItem("notifications.actions.delete");

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(screen.getByText("Custom Folder")).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting folder:",
        new Error("Failed to delete folder: 500 Internal Server Error"),
      );
    });
  });
});
