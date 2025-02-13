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
} from "@mui/material";

export default function PlayerTable(props) {

  const auth = useAuth();
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [playersWithTeams, setPlayersWithTeams] = useState([]);

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        console.log("Failed to fetch player");
      } 
    };

    fetchPlayerById(playerId);
  }, []);

  //Function to handle inviting a player to a team
  const handleInvite = (invitee) => {
    const requestBody = {
      playerId: invitee,
      teamId: player.team.id,
    };
    try {
      sendInvite(requestBody);
    } catch (err) {
      console.log("Failed to invite player");
    }
  }

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

  console.log(playersWithTeams)
  

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
                    onClick={() => handleInvite(player.id)}
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
