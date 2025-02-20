import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function NotificationsRow(props) {
  const navigate = useNavigate();

  const handleRescheduleClick = (notification) => {
    console.log("notification from NotificationsRow.jsx: ", notification);
    navigate(`/notifications/${notification._id}/reschedule-requests/${notification.rescheduleRequestId}`);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
      {props.notifications &&
        props.notifications.map((notification, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 300,
              cursor:
                notification.type === "reschedule request"
                  ? "pointer"
                  : "default",
              transition:
                notification.type === "reschedule request"
                  ? "transform 0.2s"
                  : "none",
              "&:hover":
                notification.type === "reschedule request"
                  ? {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    }
                  : {},
            }}
            onClick={() => {
              if (notification.type === "reschedule request") {
                handleRescheduleClick(notification);
              }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {notification?.type || "None"}
              </Typography>
              <Typography variant="body2">{notification?.message}</Typography>
              {notification.type === "reschedule request" && (
                <Typography variant="caption" color="text.secondary">
                  Click to respond
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}

      {props.teamInvites &&
        props.teamInvites.map((teamInvite, index) => (
          <Card key={index} sx={{ width: 300, wordWrap: "break-word" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invite from {teamInvite.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                You have been invited by {teamInvite.captainId.firstName}{" "}
                {teamInvite.captainId.lastName} to join {teamInvite.name} in{" "}
                {teamInvite.divisionId.name}.
              </Typography>
              {/* Either need to add accept/decline functionality here or redireect to where this functionality is */}
            </CardContent>
          </Card>
        ))}
    </Box>
  );
}
