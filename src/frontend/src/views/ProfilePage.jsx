import React, { useState, useEffect } from "react"
import NavBar from "../components/NavBar"
import temp_team_info from "../data/team.json";
import { getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";

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
  Button,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"

const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}))

export default function ProfilePage() {
  const auth = useAuth();
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);

    useEffect(() => {
      const fetchPlayerById = async (pid) => {
        try {
          const data = await getPlayerById(pid);
          setPlayer(data.player);
        } catch (err) {
        } 
      };
  
      fetchPlayerById(playerId);
    }, []);

    console.log(player)
  
  
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
    ],
    notifications: ["Game Rescheduled", "Game Cancelled", "Request to join accepted"],
    // invites: player.invites
  })

  // track edit mode with boolean
  const [editMode, setEditMode] = useState(false)

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

  const handleEditClick = () => {
    // TODO: Possibly open a dialog or switch text fields from read-only to editable
    // Toggle edit mode
    console.log("Edit button clicked")
    setEditMode((prev) => !prev)
  }

  return (
    <>
      <NavBar />
      <Box sx={{
          bgcolor: "grey.100",
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
              {/* Button toggles between "Edit" and "Done" */}
                <Button
                    variant="contained"
                    onClick={handleEditClick}
                    startIcon={!editMode ? <EditIcon /> : null} // only show icon if editMode is false
                    sx={{ borderRadius: 2, backgroundColor: "#7A003C"}}
                    >
                    {editMode ? "Done" : "Edit"}
                </Button>
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
                    // If NOT editMode, we set readOnly
                    InputProps={{ readOnly: !editMode }}
                    // Remove hover outlines when not in edit mode
                    sx={{
                      ...( !editMode && {
                          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                        }),
                    }}
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
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                        ...( !editMode && {
                          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                        }),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Gender
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Gender"
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      ...( !editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                      }),
                    }}
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
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      ...( !editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {borderColor: "#ccc",},
                      }),
                    }}
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
                    <ListItem key={index}>
                        <ListItemAvatar>
                        <Avatar
                            src={team.logo}
                            alt={team.name}
                            sx={{
                            width: 35,
                            height: 35,
                            bgcolor: "#7A003C",
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
                        onClick={() => console.log(`Clicked on notification: ${notif}`)}
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
