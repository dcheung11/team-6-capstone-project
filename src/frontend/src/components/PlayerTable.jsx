import React, { useEffect, useState } from "react";
import { getPlayerById } from "../api/player";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

export default function PlayerTable(props) {
  const [playersWithTeams, setPlayersWithTeams] = useState([]);
  // Function to handle inviting a player to a team
  const handleInvite = (player) => {
    console.log(`Inviting ${player.firstName} ${player.lastName} to a team`);
    // You can replace this with actual logic to send an invite
  };

  const fetchPlayerById = async (pid) => {
    let data;
    try {
      data = await getPlayerById(pid);
    } catch (err) {
      console.error("Error fetching player:", err);
    }
    return data;
  };

  useEffect(() => {
    const fetchPlayersDetails = async () => {
      const enrichedPlayers = await Promise.all(
        props.players.map(async (player) => {
          const playerData = await fetchPlayerById(player.id); // Fetch player details
          return { ...player, team: playerData.player?.team?.name || null }; // Enrich player data with team name
        })
      );
      setPlayersWithTeams(enrichedPlayers); // Set enriched players data
    };

    fetchPlayersDetails(); // Fetch all player details on component mount
  }, [props.players]);
  

  return (
    <TableContainer component={Paper} sx={{ mb: 6 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Team</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playersWithTeams.map((player, index) => (
            <TableRow key={index}>
              <TableCell>{player.firstName} {player.lastName}</TableCell>
              <TableCell>{player.team ? player.team : "No Team"}</TableCell>
              <TableCell>
                {!player.team && (
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: "#7A003C", color: "white", "&:hover": { backgroundColor: "#5A002C" } }} 
                    onClick={() => handleInvite(player)}
                  >
                    Invite to Team
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
