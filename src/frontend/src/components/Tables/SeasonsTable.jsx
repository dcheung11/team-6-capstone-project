import React, { useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteSeason, getAllSeasons } from "../../api/season";
import { formatDate } from "../../utils/Formatting";

// SeasonsTable: Displays a table of seasons with options to delete them.
const SeasonsTable = (props) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [seasonIdToDelete, setSeasonIdToDelete] = useState(null);

  // Handle delete season action
  const handleDelete = async () => {
    try {
      await deleteSeason(seasonIdToDelete);
      setNotification({
        open: true,
        message: "Season deleted successfully!",
        severity: "success",
      });
      setOpenConfirmDialog(false);
      const data = await getAllSeasons();
      props.setSeasons(data.seasons);
    } catch (err) {
      console.error(err);
      setNotification({
        open: true,
        message: "Failed to delete season.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell># Teams</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.seasons &&
              props.seasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell>{season.name}</TableCell>
                  <TableCell>{formatDate(season.startDate)}</TableCell>
                  <TableCell>{formatDate(season.endDate)}</TableCell>
                  <TableCell>{season.status}</TableCell>
                  <TableCell>{season.registeredTeams.length}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setOpenConfirmDialog(true);
                        setSeasonIdToDelete(season.id);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this season? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SeasonsTable;
