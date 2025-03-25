import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate } from "react-router";
import { getPlayerById } from "../api/player";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setPlayer(data.player);
        setTeamId(data.player.team.id);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, []);

  const handleIconClick = (event) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#7A003C", height: 92 }}
    >
      <Container style={{ marginTop: "14px" }}>
        <Toolbar disableGutters sx={{ height: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img
              src="/images/mcmaster_crest.png"
              alt="GSA Logo"
              style={{
                marginRight: "32px",
                width: "50px",
                height: "60px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button color="inherit" href="/home">
              Home
            </Button>
            <Button color="inherit" href="/announcements">
              Announcements
            </Button>
            {player && player.role !== "commissioner" && (
              <Button color="inherit" href={`/team/${teamId}`}>
                My Team
              </Button>
            )}
            <Button color="inherit" href="/schedule">
              Schedule
            </Button>
            <Button color="inherit" href="/standings">
              Standings
            </Button>
            <Button color="inherit" href="/info">
              Useful Info
            </Button>
            <Button color="inherit" href="/documentation">
              FAQ
            </Button>
            {player && player.role === "commissioner" && (
              <Button color="inherit" href="/manage">
                Manage
              </Button>
            )}
          </Box>
          <Box sx={{ ml: "auto" }}>
            <IconButton color="inherit" size="large" onClick={handleIconClick}>
              <Typography sx={{ mr: 1 }}>
                {player ? `${player.firstName} ${player.lastName}` : ""}
              </Typography>
              <PersonIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleIconClick}>
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={() => auth.logOut()}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
