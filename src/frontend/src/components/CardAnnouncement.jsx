import React from "react";
import { styled } from "@mui/material/styles";
import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: theme.spacing(2),
  backgroundColor: "#7A003C", // McMaster Burgundy
  color: "#E6E8EC", // White text for contrast
  height: "100%",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.5)",
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF", // White
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: "#FFD100", // Gold text
  "&:hover": {
    color: "#FFFFFF", // White on hover
    textDecoration: "none",
  },
}));

export default function CardAnnouncement({ announcement, userRole, onReadMore }) {
  const navigate = useNavigate();

  return (
    <StyledCard>
      <CardContent>
        <StyledTitle variant="h6">{announcement.title}</StyledTitle>
        <Typography variant="body2" paragraph>
          {announcement.content.length > 100
            ? `${announcement.content.substring(0, 100)}...`
            : announcement.content}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ color: "#FED99A", display: "flex", alignItems: "center", gap: 1 }}
            variant="caption"
          >
            {new Date(announcement.createdAt).toLocaleDateString()}
          </Typography>
          <Stack direction="row" spacing={1}>
            <StyledButton 
            onClick={() => onReadMore(announcement)}
            sx={{color: "#FED99A", textDecoration: "underline"}}
            >
                Read More</StyledButton>
            {userRole === "commissioner" && (
              <StyledButton 
                onClick={() => navigate(`/announcements/edit/${announcement._id}`)}
                startIcon={<EditIcon />}>
                EDIT
              </StyledButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </StyledCard>
  );
}
