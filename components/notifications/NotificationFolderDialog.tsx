import { CreateNewFolder as CreateNewFolderIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  Stack,
  DialogContent,
  Typography,
  DialogActions,
  Box,
  TextField,
  Button,
  Collapse,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { mutate } from "swr";

import Alert, { AlertProps } from "../Alert";

const NotificationFolderDialog = ({ openDialog, onClose, selectedFolder }) => {
  const { t } = useTranslation();
  const [feedbackMessage, setFeedbackMessage] = useState<AlertProps | null>();
  const [feedbackMessageOpen, setFeedbackMessageOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  // Mettre à jour le champ de texte lorsque `selectedFolder` change
  useEffect(() => {
    setFolderName(selectedFolder?.name || "");
  }, [selectedFolder]);

  const handleFolder = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const isRename = selectedFolder !== null; // Détermine si l'action est un renommage
    const url = isRename
      ? `/api/notificationsfolders/${selectedFolder.id}` // URL pour renommage
      : `/api/notificationsfolders`; // URL pour création
    const method = isRename ? "PATCH" : "POST"; // Méthode HTTP appropriée

    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ folderName }),
        headers: myHeaders,
      });
      mutate("/api/notificationsfolders"); // Mettre à jour les données SWR
      if (!res.ok) {
        const errorKey = isRename ? "renameFolder.error" : "createFolder.error";
        setFeedbackMessage({ severity: "error", message: t(`notifications.${errorKey}`) });
        return;
      }

      const successKey = isRename ? "renameFolder.success" : "createFolder.success";
      setFeedbackMessage({ severity: "success", message: t(`notifications.${successKey}`) });
      setFolderName("");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setFeedbackMessage({ severity: "error", message: t("notifications.generalError") });
    }
  };

  useEffect(() => {
    if (feedbackMessage) {
      setFeedbackMessageOpen(true);
      const timer = setTimeout(() => {
        setFeedbackMessageOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  return (
    <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {selectedFolder
            ? t("notifications.folderDialog.rename.title")
            : t("notifications.folderDialog.creation.title")}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            {selectedFolder
              ? t("notifications.folderDialog.rename.description")
              : t("notifications.folderDialog.creation.description")}
          </Typography>
          <TextField
            label={t(
              selectedFolder ? "notifications.folderDialog.rename.name" : "notifications.folderDialog.creation.name",
            )}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            size="small"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </Box>
      </DialogContent>
      {feedbackMessage && (
        <Collapse in={feedbackMessageOpen}>
          <Alert severity={feedbackMessage.severity} message={feedbackMessage.message} />
        </Collapse>
      )}
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          color="primary"
          startIcon={<CreateNewFolderIcon color="secondary" />}
          onClick={handleFolder}
          disabled={!folderName.trim()} // Désactive si le nom est vide
        >
          {selectedFolder
            ? t("notifications.folderDialog.rename.rename")
            : t("notifications.folderDialog.creation.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationFolderDialog;
