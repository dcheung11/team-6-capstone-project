import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Stack,
  Chip,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupIcon from "@mui/icons-material/Group";
import { deleteNotification, updateNotificationStatus } from "../api/notification.js";
import { acceptInvite, getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";

// MUI envelope icons
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

// McMaster colours
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function NotificationsRow({ notifications: initialNotifications, teamInvites }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications || []);
  const [invites, setInvites] = useState(teamInvites || []);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Sort notifications by date
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

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
      
      setInvites(prevInvites => 
        prevInvites.filter(inv => inv.id !== teamId)
      );

      await getPlayerById(auth.playerId);
      window.location.href = `/waiver?teamId=${teamId}`;
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
  
  const NotificationCard = ({ notification, isTeamInvite, team }) => {
    const isRead = notification?.status === "read";
    const borderColor = isRead ? MCMASTER_COLOURS.grey : MCMASTER_COLOURS.maroon;
    const isClickable = notification?.type === "reschedule request" || isTeamInvite;
  
    return (
       // Styling for the notification card (all sx values) - AI generated
      <Paper
        elevation={0}
        sx={{
          width: 300,
          height: 120,
          cursor: isClickable ? "pointer" : "default",
          position: "relative",
          mb: 2,
          backgroundColor: "white",
          border: `3px solid ${borderColor}`,
          borderRadius: 4,
          transition: 'all 0.2s ease-in-out',
          // Hover effect only for clickable cards 
          ...(isClickable && {
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              '& .hover-text': {
                opacity: 1,
              }
            }
          })
        }}
        onClick={() => {
          if (isTeamInvite) {
            handleTeamInviteClick(team.id);
          } else if (notification?.type === "reschedule request") {
            handleRescheduleClick(notification);
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            {/* Conditionally render envelope icons based on read/unread */}
            {isRead ? (
              <MarkEmailReadIcon sx={{ color: borderColor, fontSize: 20 }} />
            ) : (
              <MarkEmailUnreadIcon sx={{ color: borderColor, fontSize: 20 }} />
            )}
  
            <Typography
              sx={{
                color: borderColor,
                fontSize: "1.3rem",
                fontWeight: 500,
              }}
            >
              {isTeamInvite ? "Team Invite" : "Reschedule Request"}
            </Typography>
  
            {/* If not a team invite, show a delete button */}
            {!isTeamInvite && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(notification);
                }}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  color: borderColor,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: `${borderColor}15`,
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
  
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontSize: "0.9rem",
              mb: 1,
            }}
          >
            {isTeamInvite ? `Invitation to join team ${team.name}` : notification.message}
          </Typography>
  
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              className="hover-text"
              sx={{
                color: borderColor,
                fontSize: "0.75rem",
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                fontStyle: 'italic'
              }}
            >
              {isTeamInvite ? "Click to accept" : isClickable ? "Click to respond" : ""}
            </Typography>
            <Chip
              label={isRead ? "read" : "unread"}
              size="small"
              sx={{
                backgroundColor: isRead ? "transparent" : MCMASTER_COLOURS.maroon,
                color: isRead ? MCMASTER_COLOURS.grey : "white",
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 400,
                border: isRead ? `2px solid ${MCMASTER_COLOURS.grey}` : "none",
                borderRadius: "12px",
                position: "absolute",
                bottom: 12,
                right: 12,
                padding: '4px 8px'
              }}
            />
          </Stack>
        </CardContent>
      </Paper>
    );
  }
  

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {teamInvites && invites.map((team, index) => (
          <NotificationCard 
            key={index} 
            isTeamInvite={true} 
            team={team} 
          />
        ))}
        {sortedNotifications.map((notification, index) => (
          <NotificationCard 
            key={index} 
            notification={notification} 
            isTeamInvite={false}
          />
        ))}
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
