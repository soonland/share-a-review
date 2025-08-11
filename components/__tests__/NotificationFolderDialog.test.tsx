import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NotificationFolderDialog from "../notifications/NotificationFolderDialog";

jest.mock("next-translate/useTranslation", () => () => ({
  t: (key: string) => key,
}));

jest.mock("swr", () => ({
  mutate: jest.fn(),
}));

describe("NotificationFolderDialog", () => {
  const mockProps = {
    openDialog: true,
    onClose: jest.fn(),
    selectedFolder: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("rendering", () => {
    it("should render create folder dialog when no folder is selected", () => {
      render(<NotificationFolderDialog {...mockProps} />);

      expect(screen.getByText("notifications.folderDialog.creation.title")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.creation.description")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "notifications.folderDialog.creation.name" })).toBeInTheDocument();
    });

    it("should render rename folder dialog when a folder is selected", () => {
      const selectedFolder = {
        id: 1,
        name: "Test Folder",
      };
      render(<NotificationFolderDialog {...mockProps} selectedFolder={selectedFolder} />);

      expect(screen.getByText("notifications.folderDialog.rename.title")).toBeInTheDocument();
      expect(screen.getByText("notifications.folderDialog.rename.description")).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "notifications.folderDialog.rename.name" })).toBeInTheDocument();
    });

    it("should populate input with folder name when renaming", () => {
      const selectedFolder = {
        id: 1,
        name: "Test Folder",
      };
      render(<NotificationFolderDialog {...mockProps} selectedFolder={selectedFolder} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.rename.name" });
      expect(input).toHaveValue(selectedFolder.name);
    });

    it("should disable create/rename button when input is empty", () => {
      render(<NotificationFolderDialog {...mockProps} />);

      const actionButton = screen.getByText("notifications.folderDialog.creation.create");
      expect(actionButton).toBeDisabled();
    });
  });

  describe("user interactions", () => {
    it("should handle folder creation", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.creation.name" });
      await userEvent.type(input, "New Folder");

      const createButton = screen.getByText("notifications.folderDialog.creation.create");
      await userEvent.click(createButton);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/notificationsfolders",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ folderName: "New Folder" }),
        }),
      );
    });

    it("should handle folder renaming", async () => {
      const selectedFolder = {
        id: 1,
        name: "Test Folder",
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} selectedFolder={selectedFolder} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.rename.name" });
      await userEvent.clear(input);
      await userEvent.type(input, "Updated Folder");

      const renameButton = screen.getByText("notifications.folderDialog.rename.rename");
      await userEvent.click(renameButton);

      // Verify API call
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notificationsfolders/${selectedFolder.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ folderName: "Updated Folder" }),
        }),
      );
    });

    it("should show feedback message on successful action", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
        }),
      ) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.creation.name" });
      await userEvent.type(input, "New Folder");

      const createButton = screen.getByText("notifications.folderDialog.creation.create");
      await userEvent.click(createButton);

      expect(screen.getByText("notifications.createFolder.success")).toBeInTheDocument();
    });

    it("should handle cancel action", async () => {
      render(<NotificationFolderDialog {...mockProps} />);

      const cancelButton = screen.getByText("common.cancel");
      await userEvent.click(cancelButton);

      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should show error message on API failure", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.creation.name" });
      await userEvent.type(input, "New Folder");

      const createButton = screen.getByText("notifications.folderDialog.creation.create");
      await userEvent.click(createButton);

      expect(screen.getByText("notifications.createFolder.error")).toBeInTheDocument();
    });

    it("should handle network errors gracefully", async () => {
      global.fetch = jest.fn(() => Promise.reject("Network Error")) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.creation.name" });
      await userEvent.type(input, "New Folder");

      const createButton = screen.getByText("notifications.folderDialog.creation.create");
      await userEvent.click(createButton);

      expect(screen.getByText("notifications.generalError")).toBeInTheDocument();
    });

    it("should show specific error message on rename failure", async () => {
      const selectedFolder = {
        id: 1,
        name: "Test Folder",
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
        }),
      ) as jest.Mock;

      render(<NotificationFolderDialog {...mockProps} selectedFolder={selectedFolder} />);

      const input = screen.getByRole("textbox", { name: "notifications.folderDialog.rename.name" });
      await userEvent.clear(input);
      await userEvent.type(input, "Updated Name");

      const renameButton = screen.getByText("notifications.folderDialog.rename.rename");
      await userEvent.click(renameButton);

      // Verify error message
      expect(screen.getByText("notifications.renameFolder.error")).toBeInTheDocument();

      // Verify dialog did not close
      expect(mockProps.onClose).not.toHaveBeenCalled();

      // Verify input still contains the attempted name
      expect(input).toHaveValue("Updated Name");

      // Verify API call was made with correct parameters
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/notificationsfolders/${selectedFolder.id}`,
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ folderName: "Updated Name" }),
        }),
      );
    });
  });
});
