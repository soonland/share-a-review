import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Notification } from "@/models/types";

import NotificationItem from "../notifications/NotificationItem";

// Helper Functions
interface ApiResponse {
  ok: boolean;
  status?: number;
  statusText?: string;
}

const setupApiMock = (response: ApiResponse = { ok: true }) => {
  global.fetch = jest.fn(() => Promise.resolve(response)) as jest.Mock;
};

const createNotification = (overrides: Partial<Notification> = {}): Notification => ({
  id: 1,
  title: "Test Notification",
  message: "Test message content",
  type: "system",
  status: "unread",
  folder: "inbox",
  sent_at: "2024-03-01T12:00:00Z",
  ...overrides,
});

const getDeleteButton = () => {
  const button = screen.getByTestId("DeleteIcon").closest("button");
  if (!button) throw new Error("Delete button not found");
  return button;
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

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string) => key,
}));

describe("NotificationItem", () => {
  const mockNotification = createNotification();
  const mockProps = {
    notification: mockNotification,
    handleOpenDialog: jest.fn(),
    selectedNotifications: [],
    handleSelectNotification: jest.fn(),
    setSelectedNotification: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render unread notification with correct visual indicators", () => {
      render(<NotificationItem {...mockProps} />);

      const notificationContainer = screen.getByTestId("testid.notificationItem.container");
      expect(notificationContainer).toHaveClass("MuiBox-root");

      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("MuiBadge-dot");
      expect(badge).not.toHaveClass("MuiBadge-invisible");

      const title = screen.getByTestId("testid.notificationItem.title");
      expect(title).toHaveClass("MuiTypography-root");
      expect(title).toHaveTextContent(mockNotification.title);

      expect(screen.getByTestId("MarkunreadIcon")).toBeInTheDocument();
    });

    it("should render read notification with correct visual indicators", () => {
      const readNotification = createNotification({ status: "read" });
      render(<NotificationItem {...mockProps} notification={readNotification} />);

      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("MuiBadge-invisible");

      const title = screen.getByTestId("testid.notificationItem.title");
      expect(title).toHaveClass("MuiTypography-root");

      expect(screen.getByTestId("DraftsIcon")).toBeInTheDocument();
    });

    it("should handle keyboard interactions", async () => {
      render(<NotificationItem {...mockProps} />);

      const container = screen.getByTestId("testid.notificationItem.container");
      container.focus();

      await userEvent.keyboard("{Enter}");
      expect(mockProps.handleOpenDialog).toHaveBeenCalledWith(mockNotification);

      await userEvent.keyboard(" ");
      expect(mockProps.handleOpenDialog).toHaveBeenCalledTimes(2);
    });

    it("should display correct content and be accessible", () => {
      render(<NotificationItem {...mockProps} />);

      expect(screen.getByTestId("testid.notificationItem.timestamp")).toHaveTextContent(mockNotification.sent_at);

      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();

      const container = screen.getByTestId("testid.notificationItem.container");
      expect(container).toHaveAttribute("role", "button");
      expect(container).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("user interactions", () => {
    it("should handle checkbox selection with mouse and keyboard", async () => {
      const user = userEvent.setup();
      render(<NotificationItem {...mockProps} />);

      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(mockProps.handleSelectNotification).toHaveBeenCalledWith(mockNotification.id);

      await user.type(checkbox, "{space}");
      expect(mockProps.handleSelectNotification).toHaveBeenCalledTimes(2);
    });

    it("should show checkbox as checked when notification is selected", () => {
      render(<NotificationItem {...mockProps} selectedNotifications={[mockNotification.id]} />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("should open dialog when clicking the notification", async () => {
      render(<NotificationItem {...mockProps} />);

      const notificationContainer = screen.getByTestId("testid.notificationItem.container");
      await userEvent.click(notificationContainer);

      expect(mockProps.handleOpenDialog).toHaveBeenCalledWith(mockNotification);
    });

    it("should handle delete action", async () => {
      setupApiMock();
      render(<NotificationItem {...mockProps} />);

      await userEvent.click(getDeleteButton());

      verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", { folder: "trash" });
    });

    it("should prevent event propagation when clicking actions", async () => {
      render(<NotificationItem {...mockProps} />);

      const deleteButton = getDeleteButton();
      const checkbox = screen.getByRole("checkbox");

      await userEvent.click(deleteButton);
      await userEvent.click(checkbox);

      expect(mockProps.handleOpenDialog).not.toHaveBeenCalled();
    });
  });

  describe("state updates and error handling", () => {
    it("should update local state after successful API call", async () => {
      setupApiMock();
      render(<NotificationItem {...mockProps} />);

      await userEvent.click(getDeleteButton());

      verifyApiCall(`/api/notifications/${mockNotification.id}`, "PATCH", { folder: "trash" });

      expect(mockProps.setSelectedNotification).toHaveBeenCalledWith(expect.any(Function));

      const updateFn = mockProps.setSelectedNotification.mock.calls[0][0];
      const prevState = { id: 1, folder: "inbox" };
      const newState = updateFn(prevState);
      expect(newState).toEqual({ ...prevState, folder: "trash" });
    });

    it("should handle network errors gracefully", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("Network Error"))) as jest.Mock;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<NotificationItem {...mockProps} />);
      await userEvent.click(getDeleteButton());

      expect(mockProps.setSelectedNotification).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

      consoleSpy.mockRestore();
    });

    it("should handle API error responses", async () => {
      setupApiMock({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<NotificationItem {...mockProps} />);
      await userEvent.click(getDeleteButton());

      expect(mockProps.setSelectedNotification).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle missing notification props gracefully", () => {
      const incompleteNotification = createNotification({
        title: "",
        message: "",
        sent_at: "",
      });

      render(<NotificationItem {...mockProps} notification={incompleteNotification} />);

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });
  });
});
