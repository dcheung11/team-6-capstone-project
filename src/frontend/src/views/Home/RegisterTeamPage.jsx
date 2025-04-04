// Author: Derek Li
// Description: The registration page for a team to a season.
// Last Modified: 2025-03-28

import NavBar from "../../components/NavBar";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { registerTeam } from "../../api/team";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { useNavigate, useParams } from "react-router-dom";
import { getSeasonById } from "../../api/season";

// RegisterTeamPage: Redirect page for registering a team to a season - 
// takes you to the register form component

export default function RegisterTeamPage() {
  const { id: seasonId } = useParams();
  const [teamName, setTeamName] = useState("");

  // Set the initial state for team preferences
  const [division, setDivision] = useState("");
  const [preferredTime, setPreferredTime] = useState("Balanced");
  const [blacklistDay, setBlacklistDay] = useState("None");

  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [season, setSeason] = useState(null);

  // Fetch the player and season data when the component mounts
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    const fetchSeasonById = async (sid) => {
      try {
        setLoading(true);
        const data = await getSeasonById(sid);
        setSeason(data.season);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch season");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
    fetchSeasonById(seasonId);
  }, []);

  
  // Basic form handling functions
  

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
  };

  const handlePreferredTimeChange = (e) => {
    setPreferredTime(e.target.value);
  };

  const handleBlacklistDayChange = (e) => {
    setBlacklistDay(e.target.value);
  };


  // Handle form submission: Send the request to register the team and redirect to the waiver page

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = {
      name: teamName,
      divisionId: division,
      captainId: playerId,
      roster: [player],
      seasonId: seasonId,
      preferredTimes: preferredTime,
      blacklistDays: blacklistDay,
    };
    try {
      const response = await registerTeam(requestBody);
      const teamId = response.team._id;
      navigate(`/waiver?teamId=${teamId}`);
    } catch (err) {
      setError(err.message || "Failed to register team");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "4rem",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Register Team
        </Typography>
        <Typography sx={{ mb: 2 }} variant="h4">
          Season: {season && season.name}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Team Name"
            variant="outlined"
            fullWidth
            value={teamName}
            onChange={handleTeamNameChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Division</InputLabel>
            <Select
              value={division}
              onChange={handleDivisionChange}
              label="Division"
              required
            >
              {season &&
                season.divisions &&
                season.divisions.map((division) => (
                  <MenuItem key={division._id} value={division._id}>
                    {division.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Time Preferences</InputLabel>
            <Select
              value={preferredTime}
              onChange={handlePreferredTimeChange}
              label="Time Preferences"
              required
            >
              <MenuItem value="Mostly Early">Mostly Early</MenuItem>
              <MenuItem value="Balanced">Balanced</MenuItem>
              <MenuItem value="Mostly Late">Mostly Late</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Blacklist Day</InputLabel>
            <Select
              value={blacklistDay}
              onChange={handleBlacklistDayChange}
              label="Blacklist Day"
              required
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              fontWeight: 500,
              bgcolor: "black",
              color: "white",
              textTransform: "none",
              py: 1.5,
              borderRadius: "30px",
            }}
          >
            Register Team
          </Button>
        </form>
      </Container>
    </div>
  );
}
