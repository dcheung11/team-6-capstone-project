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
  const [user, setUser] = useState(null);
  const [playersWithTeams, setPlayersWithTeams] = useState([]);

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
      const enrichedPlayers = await Promise.all(
        props.players.map(async (player) => {
          const playerData = await fetchPlayerById(player.id); // Fetch player details
          return { ...player, teams: playerData.player?.teams || [] }; // Enrich player data with team name
        })
      );
      setPlayersWithTeams(enrichedPlayers); // Set enriched players data
    };

  //   fetchPlayersDetails(); // Fetch all player details on component mount
  // }, [props.players]);

  useEffect(() => {
    fetchPlayersDetails(); // Fetch all player details on component mount
  }, [props.players]);

  //Function to handle inviting a player to a team
  const handleInvite = (invitee, teamId) => {
    const requestBody = {
      playerId: invitee,
      teamId: teamId,
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
      ? { 
          ...player, 
          invites: [...(player.invites || []), teamId]  // Associate invite with the correct team
        }
      : player
      )
    );
  }
  

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
              <TableCell>{player.team ? player.team : ""}</TableCell>
              <TableCell>
                {/* {console.log(player.firstName, player.invites, user.team._id)} */}
                {user.teams.length > 0 && (
                  user.teams.map((team) => (
                    !player.teams.some(t => t.id === team.id) ? ( // Check if player is already on the team
                      !player.invites?.includes(team.id) ? ( // Check if invite was already sent
                        <Button 
                          variant="contained"
                          sx={{ backgroundColor: "#7A003C", color: "white", "&:hover": { backgroundColor: "#5A002C" }}}
                          onClick={() => handleInvite(player.id, team.id)}
                        >
                          Invite to {team.name}
                        </Button>
                      ) : (
                        <Button 
                          variant="contained"
                          sx={{ backgroundColor: "#FDBF57", color: "#7A003C", pointerEvents: "none", opacity: 1 }} // prevent clicking and keep og colour
                        >
                          Invite Sent to {team.name}
                        </Button>
                      )
                    ) : null
                  ))
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
