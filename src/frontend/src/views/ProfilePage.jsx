import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";
import { acceptInvite } from "../api/player";
import { updatePlayerInfo } from "../api/player";

import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export default function ProfilePage() {
  const auth = useAuth();
  const [rerenderTrigger, setRerenderTrigger] = useState(0);

  // placeholder profile
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    gender: "other",
    phoneNumber: "",
    email: "",
    username: "",
    team: { id: "", name: "" }, // team object with id and name
    invites: [], // Safe access
  });

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlayerById(auth.playerId);
  }, [auth.playerId]);

  // track edit mode with boolean
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = async () => {
    if (editMode) {
      try {
        console.log("Auth PlayerID:", auth.playerId);
        console.log("Saving player data to DB:", player);
        await updatePlayerInfo(auth.playerId, player); // Send update request
        console.log("Player info successfully updated!");
      } catch (err) {
        console.error("Failed to update player info", err);
      }
    }
    setEditMode((prev) => !prev);
  };  

  const handleChange = (e) => {
    setPlayer((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };  

  const handleAcceptInvite = (teamId) => {

    // Immediate state change before API call
    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      invites: prevPlayer.invites.filter((invite) => invite !== teamId),
    }));

    // Trigger re-render manually
    setRerenderTrigger((prev) => prev + 1);

    const requestBody = {
      playerId: auth.playerId,
      teamId: teamId,
    };
    try {
      acceptInvite(requestBody);
    } catch (err) {
      console.log("Failed to accept team invite");

      //Handle failure (revert the state if needed)
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        invites: [...prevPlayer.invites, teamId],
      }));
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          bgcolor: "grey.100",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Main container for profile */}
          <ProfileContainer>
            {/* Top row with avatar + name/email + edit button */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={"auto"}>
                <Avatar
                  sx={{ width: 80, height: 80, fontSize: "2rem" }}
                  alt={player.firstName}
                >
                  {/* potensh <Avatar src={profile.avatarURL} /> */}
                  {player.firstName.charAt(0) || "U"}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {player.firstName} {player.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {player.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={"auto"}>
                {/* Button toggles between "Edit" and "Done" */}
                <Button
                  variant="contained"
                  onClick={handleEditClick}
                  startIcon={!editMode ? <EditIcon /> : null} // only show icon if editMode is false
                  sx={{ borderRadius: 2, backgroundColor: "#7A003C" }}
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
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="First Name"
                    name="firtName"
                    value={player.firstName}
                    onChange={handleChange}
                    // If NOT editMode, we set readOnly
                    InputProps={{ readOnly: !editMode }}
                    // Remove hover outlines when not in edit mode
                    sx={{
                      ...(!editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                      }),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Last Name"
                    name="lastName"
                    value={player.lastName}
                    onChange={handleChange}
                    // If NOT editMode, we set readOnly
                    InputProps={{ readOnly: !editMode }}
                    // Remove hover outlines when not in edit mode
                    sx={{
                      ...(!editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                      }),
                    }}
                  />
                </Grid>

                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Email</Typography>
                  <TextField
                    fullWidth
                    name="email"
                    value={player.email}
                    onChange={handleChange}
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      ...(!editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
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
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={player.phoneNumber}
                    onChange={handleChange}
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      ...(!editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                      }),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Gender
                  </Typography>
                  <TextField
                    name="gender"
                    select
                    fullWidth
                    value={player.gender || "other"} // Ensure it always has a value
                    onChange={handleChange}
                    InputProps={{ readOnly: !editMode }}
                    sx={{
                      ...(!editMode && {
                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                          { borderColor: "#ccc" },
                      }),
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">NA/Other</MenuItem>
                  </TextField>
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
                  {player && player.team && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          src={player.team.name}
                          alt={player.team.name}
                          sx={{ width: 35, height: 35, bgcolor: "#7A003C" }}
                        >
                          {player.team.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={player.team.name} />
                    </ListItem>
                  )}
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Team Invites
                </Typography>
                <List disablePadding>
                  {player.invites?.map((team, index) => (
                    <ListItem
                      key={team.id}
                      secondaryAction={
                        <>
                          <Button
                            color="success"
                            onClick={() => handleAcceptInvite(team.id)}
                            sx={{ mr: 1 }}
                          >
                            Accept
                          </Button>
                          {/* <Button color="error" onClick={() => handleDeclineInvite(team)}>Decline</Button> */}
                        </>
                      }
                    >
                      <ListItemText primary={team.name} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </ProfileContainer>
        </Container>
      </Box>
    </>
  );
}
