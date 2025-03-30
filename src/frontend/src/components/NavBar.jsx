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
import { useNavigate, useLocation } from "react-router";
import { getPlayerById } from "../api/player";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

// NavBar: Displays the navigation bar with links to different pages and user profile options.
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [teamId, setTeamId] = useState("");
  const role = localStorage.getItem("role");

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

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: MCMASTER_COLOURS.maroon, height: 92 }}
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
            <Button 
              color="inherit" 
              href="/home"
              sx={{ 
                color: isCurrentPage('/home') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/home') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              href="/announcements"
              sx={{ 
                color: isCurrentPage('/announcements') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/announcements') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              Announcements
            </Button>
            {role !== "commissioner" && (
              <Button 
              color="inherit" 
              href={`/team/${teamId}`}
              sx={{ 
                color: isCurrentPage(`/team/${teamId}`) ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage(`/team/${teamId}`) ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
                My Team
              </Button>
            )}
            <Button 
              color="inherit" 
              href="/schedule"
              sx={{ 
                color: isCurrentPage('/schedule') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/schedule') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              Schedule
            </Button>
            <Button 
              color="inherit" 
              href="/standings"
              sx={{ 
                color: isCurrentPage('/standings') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/standings') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              Standings
            </Button>
            <Button 
              color="inherit" 
              href="/info"
              sx={{ 
                color: isCurrentPage('/info') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/info') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              Useful Info
            </Button>
            <Button 
              color="inherit" 
              href="/documentation"
              sx={{ 
                color: isCurrentPage('/documentation') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/documentation') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
              FAQ
            </Button>
            {role === "commissioner" && (
              <Button 
              color="inherit" 
              href="/manage"
              sx={{ 
                color: isCurrentPage('/manage') ? MCMASTER_COLOURS.gold : 'inherit',
                '&:hover': {
                  color: isCurrentPage('/manage') ? MCMASTER_COLOURS.gold : 'inherit',
                }
              }}
            >
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
