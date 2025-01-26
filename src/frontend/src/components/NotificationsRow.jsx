import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function NotificationsRow(props) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 6, overflowX: "auto" }}>
      {props.notifications.map((notification, index) => (
        <Card key={index} sx={{ minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {notification.title}
            </Typography>
            <Typography variant="body2">{notification.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
