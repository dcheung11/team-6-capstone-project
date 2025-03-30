import React, { useEffect, useState } from "react";
import { getPlayerById } from "../../api/player";
import { useAuth } from "../../hooks/AuthProvider";
import { sendInvite } from "../../api/player";
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

// McMaster colours
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

// PlayerTable: Displays a table of players with options to invite them to a team.
export default function PlayerTable(props) {

  const auth = useAuth();
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [user, setUser] = useState(null);
  const [playersWithTeams, setPlayersWithTeams] = useState(props.players);
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

  // Update state when props.players changes
  useEffect(() => {
    setPlayersWithTeams(props.players);
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

  // Function to toggle the filter for players with no team
  const toggleFilter = () => {
    setShowOnlyNoTeam((prev) => !prev);
  };

  // Filter players based on search query and whether they have a team
  const filteredPlayers = (
    showOnlyNoTeam
      ? playersWithTeams.filter((player) => !player.team)
      : playersWithTeams
  ).filter((player) => {
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const isNotCommissioner = player.role !== "commissioner"; // Exclude commissioner role
    return fullName.includes(searchQuery.toLowerCase()) && isNotCommissioner;
  });

  // Sort players alphabetically by first name, then last name
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        mb: 6, 
        p: 2,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
        backgroundColor: 'white',
        '& .MuiTable-root': {
          borderRadius: 2,
          overflow: 'hidden',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
          borderRadius: '2px 2px 0 0'
        }
      }}
    >
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              label="Search Players"
              variant="outlined"
              fullWidth
              sx={{ 
                flexBasis: "66%",
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: MCMASTER_COLOURS.maroon,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: MCMASTER_COLOURS.maroon,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: MCMASTER_COLOURS.maroon,
                }
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: MCMASTER_COLOURS.maroon,
                color: "white",
                flexBasis: "33%",
                height: '56px',
                '&:hover': {
                  backgroundColor: '#5C002E',
                }
              }}
              onClick={toggleFilter}
            >
              {showOnlyNoTeam
                ? "Show All Players"
                : "Show Players with No Team"}
            </Button>
          </Box>

          <Table>
            <TableHead sx={{ background: MCMASTER_COLOURS.maroon}}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: '1.2rem', }}>Player</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: '1.2rem', }}>Team</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: '1.2rem', }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow key={index} sx={{ '&:hover': { backgroundColor: MCMASTER_COLOURS.lightGrey } }}>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    {player.firstName} {player.lastName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.1rem' }}>
                    {player?.team ? player.team.name : "No Team"}
                  </TableCell>
                  {/* Invite Button if not on a team and not invited yet */}
                  <TableCell>
                    {player?.team ? null : !player?.invites?.includes(
                        user?.team?._id
                      ) ? (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: MCMASTER_COLOURS.maroon,
                          color: "white",
                          width: '140px',
                          height: '36px',
                          '&:hover': { 
                            backgroundColor: '#5C002E' 
                          },
                        }}
                        onClick={() => handleInvite(player.id)}
                      >
                        Invite to Team
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: MCMASTER_COLOURS.gold,
                          color: MCMASTER_COLOURS.maroon,
                          width: '140px',
                          height: '36px',
                          pointerEvents: "none",
                          opacity: 1,
                        }}
                      >
                        Invite Sent
                      </Button>
                    )}
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
