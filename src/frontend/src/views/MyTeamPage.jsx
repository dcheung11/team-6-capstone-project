import {
  Typography,
  Container,
  Box,
  Tab,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import NavBar from "../components/NavBar";
import RosterTable from "../components/RosterTable";
import ScheduleTable from "../components/ScheduleTable";
import GamesRow from "../components/GamesRow";
import NotificationsRow from "../components/NotificationsRow";
import temp_team_info from "../data/team.json";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getNotificationsByTeamId } from "../api/notification";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NoDataCard from "../components/NoDataCard";
import { useNavigate, useParams } from "react-router-dom";
import { getScheduleGamesByTeamId } from "../api/team";
import LoadingOverlay from "../components/LoadingOverlay";
import ContactInfoTable from "../components/ContactInfoTable";

// McMaster colours - AI Generated
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

export default function MyTeamPage() {
  const auth = useAuth();
  const { id: teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState(null);
  const [teamNotifications, setTeamNotifications] = useState(null);

  const [teamTabValue, setTeamTabValue] = useState(teamId || null);

  const handleChange = (event, newValue) => {
    setTeamTabValue(newValue);
    // Only navigate if it's a team tab
    if (newValue !== "contacts") {
      navigate(`/team/${newValue}`);
    }
  };

  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, []);

  useEffect(() => {
    if (!player || teamTabValue === "contacts") return;

    const fetchScheduleGamesByTeamId = async (tid) => {
      try {
        const data = await getScheduleGamesByTeamId(tid);
        setTeamGames(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch schedule games");
      } finally {
        setLoading(false); // Set loading false only once, after both API calls
      }
    };

    if (teamTabValue) {
      fetchScheduleGamesByTeamId(teamTabValue);
    }
  }, [player, teamTabValue]);

  useEffect(() => {
    if (!player || teamTabValue === "contacts") return;

    const fetchNotificationsByTeamId = async (tid) => {
      try {
        const data = await getNotificationsByTeamId(tid);
        // this data doesn't populate rescheduleRequestIds
        setTeamNotifications(data.notifications || data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch notifications");
      } finally {
        setLoading(false); // Set loading false only once, after both API calls
      }
    };

    if (teamTabValue) {
      fetchNotificationsByTeamId(teamTabValue);
    }
  }, [player, teamTabValue]);

  return (
    <div 
      style={{ 
        backgroundColor: MCMASTER_COLOURS.lightGrey,
        minHeight: '100vh',
        height: '100%',
        position: 'fixed',
        width: '100%',
        overflowY: 'auto'
      }}
    >
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 3
          }}
        >
          My Team
        </Typography>

        {loading ? (
          <LoadingOverlay loading={loading} />
        ) : player && player.team ? (
          <>
            <TabContext value={teamTabValue}>
              {player.team.captainId.id === playerId && ( // Only show tabs for captains
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  {/* AI Generated - Tablist styling */}
                  <TabList 
                    onChange={handleChange}
                    sx={{
                      '& .Mui-selected': {
                        color: `${MCMASTER_COLOURS.maroon} !important`,
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: MCMASTER_COLOURS.maroon,
                      }
                    }}
                  >
                    <Tab label={player.team.name} value={player.team.id} />
                    <Tab label="Captain Contacts" value="contacts" />
                  </TabList>
                </Box>
              )}

              <TabPanel value={player.team.id}>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                      color: MCMASTER_COLOURS.maroon,
                      fontWeight: 700,
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      mb: 1,
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 1
                    }}
                  >
                    {player.team.name}
                    {player.team.captainId.id === playerId && (
                      <Typography
                        component="span"
                        sx={{
                          ml: 1,
                          color: MCMASTER_COLOURS.grey,
                          fontWeight: "normal",
                          fontSize: "0.8em",
                        }}
                      >
                        (captain)
                      </Typography>
                    )}
                  </Typography>

                  <Stack 
                    direction="row" 
                    spacing={4} 
                    mb={4}
                    mt={2}
                    sx={{ 
                      p: 2,
                      bgcolor: 'white',
                      borderRadius: 1,
                      //boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.1)',
                      '& .stat-label': {
                        color: MCMASTER_COLOURS.grey,
                        fontWeight: "bold",
                        fontSize: '1.1rem',
                      },
                      '& .stat-value': {
                        fontSize: '1.1rem',
                        fontWeight: 500,
                      }
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">Season:</Typography>
                      <Typography className="stat-value">{player.team.seasonId.name}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">Division:</Typography>
                      <Typography className="stat-value">{player.team.divisionId.name}</Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">Record (W/D/L):</Typography>
                      <Typography className="stat-value">
                        {player.team.wins}-{player.team.draws}-{player.team.losses}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 4 }} />

                  {/* For captain view */}
                  {(player.team.captainId.id === playerId ||
                    player.role === "commissioner") && (
                    <>
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: "2rem",
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        Scheduling Notifications
                      </Typography>
                      {teamNotifications && teamNotifications.length > 0 ? (
                        <NotificationsRow notifications={teamNotifications} />
                      ) : (
                        <NoDataCard text="No notifications to show." />
                      )}
                      <Divider sx={{ my: 4 }} />
                    </>
                  )}

                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Team Schedule
                  </Typography>
                  {teamGames && teamGames.games && teamGames.games.length > 0 ? (
                    <ScheduleTable
                      schedule={teamGames}
                      captain={player.team.captainId.id}
                      player={playerId}
                      role={player.role}
                      archived={teamGames.archived}
                    />
                  ) : (
                    <NoDataCard text="No schedule to show." />
                  )}

                  <Divider sx={{ my: 6 }} />

                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Roster
                  </Typography>
                  <RosterTable
                    roster={player.team.roster}
                    captain={player.team.captainId}
                  />
                  {player.team.captainId.id === playerId && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: MCMASTER_COLOURS.maroon,
                        mt: 1,
                        mb: 2,
                        '&:hover': {
                          bgcolor: '#5A002C',
                        }
                      }}
                      onClick={() => navigate("/players")}
                    >
                      Invite Players
                    </Button>
                  )}
                  

                </Box>
              </TabPanel>

              {/* Contacts Panel */}
              {/* AI Generated - contacts panel styling */}
              {player.team.captainId.id === playerId && ( // Only show contacts panel for captains
                <TabPanel value="contacts">
                  <Box>
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      sx={{ 
                        color: MCMASTER_COLOURS.maroon,
                        fontWeight: "bold",
                        mb: 2
                      }}
                    >
                      Captain Contact Information
                    </Typography>
                    <ContactInfoTable
                      currentSeasonId={
                        player?.team?.seasonId?._id || player?.team?.seasonId
                      }
                    />
                  </Box>
                </TabPanel>
              )}
            </TabContext>
          </>
        ) : (
          <Box>            
            <Typography variant="subtitle2" sx={{
              fontSize: { xs: "2rem", md: "2rem" },
              fontWeight: 700,
              mb: 2,
            }}>
              Team Invitations
            </Typography>
            {player && player.invites && player.invites.length > 0 ? (
              <NotificationsRow teamInvites={player.invites} />
            ) : (
              <NoDataCard text="No team invitations to show. Join or create a team to see team information." />
            )}
          </Box>
        )}
      </Container>
    </div>
  );
}
