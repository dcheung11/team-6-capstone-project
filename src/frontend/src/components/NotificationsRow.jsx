import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function NotificationsRow(props) {
  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
      {props.notifications &&
        props.notifications.map((notification, index) => (
          <Card key={index} sx={{ minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {notification.title}
              </Typography>
              <Typography variant="body2">
                {notification.description}
              </Typography>
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
