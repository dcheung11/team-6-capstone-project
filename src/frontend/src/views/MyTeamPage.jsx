import { Typography, Container, Box, Tab, Stack, Button } from "@mui/material";
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
    if (newValue !== 'contacts') {
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
    if (!player || teamTabValue === 'contacts') return;

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
    if (!player || teamTabValue === 'contacts') return;

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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Teams
        </Typography>
        {loading ? (
          <LoadingOverlay loading={loading} />
        ) : player && player.team ? (
          <TabContext value={teamTabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab label={player.team.name} value={player.team.id} />
                {(player.team.captainId.id === playerId || player.role === "commissioner") && (
                  <Tab label="Captain Contacts" value="contacts" />
                )}
              </TabList>
            </Box>
            
            {/* Team Panel */}
            <TabPanel value={player.team.id}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  <span style={{ color: "#7A003C", fontWeight: "bold" }}>
                    {player.team.name}
                  </span>
                  {player.team.captainId.id === playerId && (
                    <span
                      style={{
                        color: "gray",
                        fontWeight: "normal",
                        fontSize: "0.8em",
                      }}
                    >
                      {" "}
                      (captain)
                    </span>
                  )}
                </Typography>
                <Stack
                  direction="row"
                  spacing={4}
                  marginBottom={2}
                  alignItems="center"
                >
                  <Typography variant="h6" component="h2">
                    {player.team.seasonId.name}: {player.team.divisionId.name}
                  </Typography>
                  <Typography variant="h6" component="h2">
                    Record (W/D/L): {player.team.wins}-{player.team.draws}-
                    {player.team.losses}
                  </Typography>
                </Stack>

                {/* For captain view */}
                {(player.team.captainId.id === playerId ||
                  player.role === "commissioner") && (
                  <>
                    <Typography variant="h4" component="h2" gutterBottom>
                      Notifications
                    </Typography>
                    {teamNotifications && teamNotifications.length > 0 ? (
                      <NotificationsRow notifications={teamNotifications} />
                    ) : (
                      <NoDataCard text="No notifications to show." />
                    )}
                  </>
                )}

                <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
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
                      bgcolor: "#800020",
                      mb: 2,
                    }}
                    onClick={() => navigate("/players")}
                  >
                    Invite Players
                  </Button>
                )}

                <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
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
              </Box>
            </TabPanel>

            {/* Contacts Panel */}
            <TabPanel value="contacts">
              <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                  Captain Contact Information
                </Typography>
                <ContactInfoTable currentSeasonId={player?.team?.seasonId?._id || player?.team?.seasonId} />
              </Box>
            </TabPanel>

          </TabContext>
        ) : (
          <NoDataCard text="No teams to show. Join or create a team to see team information." />
        )}
      </Container>
    </div>
  );
}
