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
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

const NotificationFolderDialog = ({ openDialog, onClose }) => {
  const { t } = useTranslation();
  const [folderName, setFolderName] = useState("");

  const createFolder = async () => {
    // Envoie une notification
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    await fetch(`/api/notificationsfolders`, {
      method: "POST",
      body: JSON.stringify({ name: folderName }),
      headers: myHeaders,
    });
  };

  return (
    <Dialog open={openDialog} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={2} justifyContent={"space-between"}>
          {t("notifications.createFolder.title")}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">{t("notifications.createFolder.description")}</Typography>
          <TextField
            label={t("notifications.createFolder.name")}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            size="small"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button color="primary" startIcon={<CreateNewFolderIcon color="secondary" />} onClick={createFolder}>
          {t("notifications.createFolder.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationFolderDialog;
