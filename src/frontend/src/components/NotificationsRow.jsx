import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteNotification, updateNotificationStatus } from "../api/notification.js";

export default function NotificationsRow({ notifications: initialNotifications }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleRescheduleClick = async (notification) => {
    await updateNotificationStatus(notification._id, 'read');
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
      n._id === notification._id ? { ...n, status: 'read' } : n
      )
    );
    navigate(`/notifications/${notification._id}/reschedule-requests/${notification.rescheduleRequestId}`);
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNotification) {
      setNotifications(notifications.filter((n) => n._id !== selectedNotification._id));
      await deleteNotification(selectedNotification._id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {notifications?.length > 0 ? (
          notifications.map((notification, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                cursor: notification.type === "reschedule request" ? "pointer" : "default",
                transition: notification.type === "reschedule request" ? "transform 0.2s" : "none",
                "&:hover": notification.type === "reschedule request" ? { transform: "translateY(-2px)", boxShadow: 3 } : {},
                position: "relative",
                backgroundColor: notification.status === "read" ? "lightgray" : "white", // Change color if read
              }}
              onClick={() => {
                if (notification.type === "reschedule request") {
                  handleRescheduleClick(notification);
                }
              }}
            >
              <CardContent>
                {/* Delete Button in Top Right */}
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleDeleteClick(notification);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Notification Type */}
                <Typography variant="h6" gutterBottom>
                  {notification?.type || "None"}
                </Typography>

                {/* Notification Message */}
                <Typography variant="body2">{notification?.message}</Typography>

                {/* Reschedule Request Message */}
                {notification.type === "reschedule request" && notification.status === 'unread' && (
                  <Typography variant="caption" color="text.secondary">
                    Click to respond
                  </Typography>
                )}

                {/* Status in Bottom Right */}
                <Box sx={{ textAlign: "right", mt: 2 }}>
                  <Typography variant="caption" sx={{ color: "gray", fontSize: "12px" }}>
                    {notification.status}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: "gray" }}>
            No notifications available.
          </Typography>
        )}
      </Box>

      {/* Delete Confirmation Popup */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Clear Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear this notification?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
