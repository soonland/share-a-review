import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Notification } from "@/models/types";

import NotificationItem from "../notifications/NotificationItem";

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string) => key,
}));

describe("NotificationItem", () => {
  const mockNotification: Notification = {
    id: 1,
    title: "Test Notification",
    message: "Test message content",
    type: "system",
    status: "unread",
    folder: "inbox",
    sent_at: "2024-03-01T12:00:00Z",
  };

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

      // Check notification container styling
      const notificationContainer = screen.getByTestId("testid.notificationItem.container");
      expect(notificationContainer).toHaveClass("MuiBox-root");

      // Check badge visibility
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("MuiBadge-dot");
      expect(badge).not.toHaveClass("MuiBadge-invisible");

      // Check title styling
      const title = screen.getByTestId("testid.notificationItem.title");
      expect(title).toHaveClass("MuiTypography-root");
      expect(title).toHaveTextContent(mockNotification.title);

      // Check icon presence
      expect(screen.getByTestId("MarkunreadIcon")).toBeInTheDocument();
    });

    it("should render read notification with correct visual indicators", () => {
      const readNotification = {
        ...mockNotification,
        status: "read",
      };
      render(<NotificationItem {...mockProps} notification={readNotification} />);

      // Check badge visibility
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("MuiBadge-invisible");

      // Check title styling
      const title = screen.getByTestId("testid.notificationItem.title");
      expect(title).toHaveClass("MuiTypography-root");

      // Check icon presence
      expect(screen.getByTestId("DraftsIcon")).toBeInTheDocument();
    });

    it("should handle keyboard interactions", async () => {
      render(<NotificationItem {...mockProps} />);

      const container = screen.getByTestId("testid.notificationItem.container");

      // Test Enter key
      container.focus();
      await userEvent.keyboard("{Enter}");
      expect(mockProps.handleOpenDialog).toHaveBeenCalledWith(mockNotification);

      // Test Space key
      await userEvent.keyboard(" ");
      expect(mockProps.handleOpenDialog).toHaveBeenCalledTimes(2);
    });

    it("should display correct content and be accessible", () => {
      render(<NotificationItem {...mockProps} />);

      // Check timestamp
      expect(screen.getByTestId("testid.notificationItem.timestamp")).toHaveTextContent(mockNotification.sent_at);

      // Check interactive elements have proper ARIA roles
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();

      // Check container is clickable
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

      // Test mouse interaction
      await user.click(checkbox);
      expect(mockProps.handleSelectNotification).toHaveBeenCalledWith(mockNotification.id);

      // Test keyboard interaction
      await user.type(checkbox, "{space}");
      expect(mockProps.handleSelectNotification).toHaveBeenCalledTimes(2);
    });

    it("should show checkbox as checked when notification is selected", () => {
      render(<NotificationItem {...mockProps} selectedNotifications={[mockNotification.id]} />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("should open dialog when clicking the notification", async () => {
      render(<NotificationItem {...mockProps} />);

      const notificationContainer = screen.getByTestId("testid.notificationItem.container");
      await userEvent.click(notificationContainer);

      expect(mockProps.handleOpenDialog).toHaveBeenCalledWith(mockNotification);
    });

    it("should handle delete action", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationItem {...mockProps} />);

      const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
      if (!deleteButton) throw new Error("Delete button not found");
      await userEvent.click(deleteButton);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ folder: "trash" }),
        }),
      );
    });

    it("should prevent event propagation when clicking actions", async () => {
      render(<NotificationItem {...mockProps} />);

      const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
      if (!deleteButton) throw new Error("Delete button not found");
      const checkbox = screen.getByRole("checkbox");

      await userEvent.click(deleteButton);
      await userEvent.click(checkbox);

      expect(mockProps.handleOpenDialog).not.toHaveBeenCalled();
    });
  });

  describe("state updates and error handling", () => {
    it("should update local state after successful API call", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationItem {...mockProps} />);

      const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
      if (!deleteButton) throw new Error("Delete button not found");
      await userEvent.click(deleteButton);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notifications/${mockNotification.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ folder: "trash" }),
        }),
      );

      // Verify local state update
      expect(mockProps.setSelectedNotification).toHaveBeenCalledWith(expect.any(Function));

      // Test the state update function
      const updateFn = mockProps.setSelectedNotification.mock.calls[0][0];
      const prevState = { id: 1, folder: "inbox" };
      const newState = updateFn(prevState);
      expect(newState).toEqual({ ...prevState, folder: "trash" });
    });

    it("should handle network errors gracefully", async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error("Network Error"))) as jest.Mock;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<NotificationItem {...mockProps} />);

      const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
      if (!deleteButton) throw new Error("Delete button not found");
      await userEvent.click(deleteButton);

      // Verify error handling
      expect(mockProps.setSelectedNotification).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

      consoleSpy.mockRestore();
    });

    it("should handle API error responses", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        }),
      ) as jest.Mock;
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      render(<NotificationItem {...mockProps} />);

      const deleteButton = screen.getByTestId("DeleteIcon").closest("button");
      if (!deleteButton) throw new Error("Delete button not found");
      await userEvent.click(deleteButton);

      // Verify error handling
      expect(mockProps.setSelectedNotification).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should handle missing notification props gracefully", () => {
      // Testing with minimum required props
      const incompleteNotification: Notification = {
        id: 1,
        title: "",
        message: "",
        type: "system",
        status: "unread",
        folder: "inbox",
        sent_at: "",
      };

      render(<NotificationItem {...mockProps} notification={incompleteNotification as Notification} />);

      // Should not crash and render basic elements
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });
  });
});
