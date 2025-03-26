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
import { acceptInvite, getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";

export default function NotificationsRow({ notifications: initialNotifications, teamInvites }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [invites, setInvites] = useState(teamInvites || []);
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

  const handleTeamInviteClick = async (teamId) => {
    try {
      const requestBody = {
        playerId: auth.playerId,
        teamId: teamId,
      };

      await acceptInvite(requestBody);
      
      // Update local state to remove the accepted invite
      setInvites(prevInvites => 
        prevInvites.filter(inv => inv.id !== teamId)
      );

      // Fetch updated player data to ensure the join is processed
      await getPlayerById(auth.playerId);

      // Now navigate to the team page
      window.location.href = `/team/${teamId}`;
      console.log("Team invite accepted");
    } catch (err) {
      console.log("Failed to accept team invite");
    }
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
        {teamInvites ? (
          // Render team invites
          invites.map((team, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 3 },
                position: "relative",
              }}
              onClick={() => handleTeamInviteClick(team.id)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Team Invite
                </Typography>
                <Typography variant="body2">
                  Invitation to join team {team.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to accept
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          // Render regular notifications
          notifications.map((notification, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 300,
                cursor: notification.type === "reschedule request" ? "pointer" : "default",
                transition: notification.type === "reschedule request" ? "transform 0.2s" : "none",
                "&:hover": notification.type === "reschedule request" ? { transform: "translateY(-2px)", boxShadow: 3 } : {},
                position: "relative",
                backgroundColor: notification.status === "read" ? "lightgray" : "white",
              }}
              onClick={() => {
                if (notification.type === "reschedule request") {
                  handleRescheduleClick(notification);
                }
              }}
            >
              <CardContent>
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(notification);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {notification.type || "None"}
                </Typography>

                <Typography variant="body2">{notification.message}</Typography>

                {notification.type === "reschedule request" && notification.status === 'unread' && (
                  <Typography variant="caption" color="text.secondary">
                    Click to respond
                  </Typography>
                )}

                <Box sx={{ textAlign: "right", mt: 2 }}>
                  <Typography variant="caption" sx={{ color: "gray", fontSize: "12px" }}>
                    {notification.status}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

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
