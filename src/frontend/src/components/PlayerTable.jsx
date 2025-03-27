import React, { useEffect, useState } from "react";
import { getPlayerById } from "../api/player";
import { useAuth } from "../hooks/AuthProvider";
import { sendInvite } from "../api/player";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
} from "@mui/material";

export default function PlayerTable(props) {

  const auth = useAuth();
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [user, setUser] = useState(null);
  const [playersWithTeams, setPlayersWithTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOnlyNoTeam, setShowOnlyNoTeam] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // own user information
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setUser(data.player);
      } catch (err) {
        console.log("Failed to fetch player");
      } 
    };

    fetchPlayerById(playerId);
  }, []);

  // multiple team logic
  // console.log(user?.team?.captainId?.id, user?.id)

  // Fetch player details by player ID
  const fetchPlayerById = async (pid) => {
    let data;
    try {
      data = await getPlayerById(pid);
    } catch (err) {
      console.error("Error fetching player:", err);
    }
    return data;
  };

  // Fetch all player details
  // useEffect(() => {
    const fetchPlayersDetails = async () => {
      try {
        setLoading(true);
        const enrichedPlayers = await Promise.all(
          props.players.map(async (player) => {
            const playerData = await fetchPlayerById(player.id); // Fetch player details
            return { ...player, team: playerData.player?.team?.name || null }; // Enrich player data with team name
          })
        );
        setPlayersWithTeams(enrichedPlayers); // Set enriched players data
      }
      catch (err) {
        console.log("Failed to fetch players");
      }
      finally {
        setLoading(false);
      }
    };

  //   fetchPlayersDetails(); // Fetch all player details on component mount
  // }, [props.players]);

  useEffect(() => {
    fetchPlayersDetails(); // Fetch all player details on component mount
  }, [props.players]);

  //Function to handle inviting a player to a team
  const handleInvite = (invitee) => {
    const requestBody = {
      playerId: invitee,
      teamId: user.team.id,
    };
    try {
      sendInvite(requestBody);
    } catch (err) {
      console.log("Failed to invite player");
    }

    // Immediately update the state after sending the invite
    setPlayersWithTeams((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === invitee
          ? { ...player, invites: [...(player.invites || []), user.team._id] } // Add user.team._id to invites
          : player
      )
    );
  }

  const toggleFilter = () => {
    setShowOnlyNoTeam((prev) => !prev);
  };

    const filteredPlayers = (showOnlyNoTeam
      ? playersWithTeams.filter((player) => !player.team)
      : playersWithTeams
    ).filter((player) => {
      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });

    // Sort players alphabetically by first name, then last name
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <TableContainer component={Paper} sx={{ mb: 6, p: 2 }}>
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
           <TextField
            label="Search Players"
            variant="outlined"
            fullWidth
            sx={{ mb: 2, flexBasis: '66%'}}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
            <Button
        variant="contained"
        sx={{ marginBottom: 2, backgroundColor: "#7A003C", color: "white", flexBasis: '33%' }}
        onClick={toggleFilter}
      >
        {showOnlyNoTeam ? "Show All Players" : "Show Players with No Team"}
      </Button>
      </Box>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Team</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow key={index}>
                <TableCell>{player.firstName} {player.lastName}</TableCell>
                <TableCell>{player.team ? player.team : "No Team"}</TableCell>
                <TableCell>
                  {!player.team ? (
                    !player.invites?.includes(user.team._id) ? (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#7A003C",
                          color: "white",
                          "&:hover": { backgroundColor: "#5A002C" },
                        }}
                        onClick={() => handleInvite(player.id)}
                      >
                        Invite to Team
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#FDBF57",
                          color: "#7A003C",
                          pointerEvents: "none",
                          opacity: 1,
                        }}
                      >
                        Invite Sent
                      </Button>
                    )
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}
    </TableContainer>
  );
}
