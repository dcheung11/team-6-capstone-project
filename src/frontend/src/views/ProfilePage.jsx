import React, { useState, useEffect } from "react"
import NavBar from "../components/NavBar"
import temp_team_info from "../data/team.json";

import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"

// Example styled container if you want a similar “card” effect
const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}))

export default function ProfilePage() {
  // placeholder profile
  const [profile, setProfile] = useState({
    fullName: "",
    nickname: "",
    gender: "",
    phoneNumber: "",
    email: "",
    username: "",
    teams: [
        { name: temp_team_info.team_name, logo: temp_team_info.team_logo },
        { name: "Warriors", logo: "/images/warriors.png" },
        { name: "Lakers", logo: "/images/lakers.png" }
    ],
    notifications: ["Game Rescheduled", "Game Cancelled", "Request to join accepted"],
  })

  // TODO: On component mount, fetch profile details from backend
  useEffect(() => {
    // using placeholder data
    setProfile((p) => ({
      ...p,
      fullName: "LeBron James",
      nickname: "jad",
      email: "LeGoat@gmail.com",
      gender: "",
      phoneNumber: "",
    }))
  }, [])

  // Example edit handler
  const handleEditClick = () => {
    // TODO: Possibly open a dialog or switch text fields from read-only to editable
    console.log("Edit button clicked")
  }

  return (
    <>
      <NavBar />
      <Box sx={{
          bgcolor: "grey.100", // or your choice of off‐white
          minHeight: "100vh",
          py: 4,
        }}>
        <Container maxWidth="lg">
          {/* Main container for profile */}
          <ProfileContainer>
            {/* Top row with avatar + name/email + edit button */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={"auto"}>
                <Avatar
                  sx={{ width: 80, height: 80, fontSize: "2rem" }}
                  alt={profile.fullName}
                >
                  {/* potensh <Avatar src={profile.avatarURL} /> */}
                  {profile.fullName.charAt(0) || "U"}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {profile.fullName} ({profile.nickname})
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profile.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={"auto"}>
                <IconButton
                  color="primary"
                  onClick={handleEditClick}
                  sx={{ borderRadius: 2 }}
                >
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* Form fields (full name, nickname, gender, phone) */}
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Full Name"
                    value={profile.fullName}
                    // readOnly or disabled until edit mode
                    InputProps={{ readOnly: true }}
                    // TODO: onChange handler if editable
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Nick Name (optional)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Nickname"
                    value={profile.nickname}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Gender
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Gender"
                    value={profile.gender}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Phone Number"
                    value={profile.phoneNumber}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* My Teams + Notifications */}
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  My Teams
                </Typography>
                <List>
                    {profile.teams.map((team, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemAvatar>
                        <Avatar
                            src={team.logo}
                            alt={team.name}
                            sx={{
                            width: 35,
                            height: 35,
                            bgcolor: "primary.light", // Fallback background color
                            }}
                        >
                            {/* Fallback text if logo is missing: first letter of the team name */}
                            {team.name.charAt(0)}
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={team.name} />
                    </ListItem>
                    ))}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notifications
                </Typography>
                <List disablePadding>
                  {profile.notifications.map((notif, index) => (
                    <ListItem disablePadding key={index}>
                      <ListItemButton
                        onClick={() => alert(`Clicked on notification: ${notif}`)}
                      >
                        <ListItemText primary={notif} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </ProfileContainer>
        </Container>
      </Box>
    </>
  )
}
