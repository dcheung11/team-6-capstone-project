import { Typography, Container, Box, Tab, Stack } from "@mui/material";
import NavBar from "../components/NavBar";
import RosterTable from "../components/RosterTable";
import ScheduleTable from "../components/ScheduleTable";
import GamesRow from "../components/GamesRow";
import NotificationsRow from "../components/NotificationsRow";
import temp_team_info from "../data/team.json";
import dummySchedule from "../data/schedule.json";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NoDataCard from "../components/NoDataCard";
import { useNavigate, useParams } from "react-router-dom";

export default function MyTeamPage() {
  const auth = useAuth();
  const { id: teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);

  const [teamTabValue, setTeamTabValue] = useState(teamId || null);

  const handleChange = (event, newValue) => {
    setTeamTabValue(newValue);
    navigate(`/team/${newValue}`); // Update URL on tab change
  };

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

    fetchPlayerById(playerId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Maybe we add a tab for the teams a player is on, and it could be href to /team/:teamId ? */}
        <Typography variant="h4" component="h2" gutterBottom>
          Teams
        </Typography>
        {player && player.team ? (
          <TabContext value={teamTabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange}>
                <Tab label={player.team.name} value={player.team.id} />
              </TabList>
            </Box>
            <TabPanel value={player.team.id}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {player.team.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={4}
                  marginBottom={2}
                  alignItems="center"
                >
                  <Typography variant="h6" component="h2">
                    Record (W/D/L): {player.team.wins}-{player.team.draws}-
                    {player.team.losses}
                  </Typography>

                  <Typography variant="h6" component="h2">
                    {player.team.divisionId.name}
                  </Typography>
                </Stack>

                {/* For captain view */}
                <Typography variant="h4" component="h2" gutterBottom>
                  Notifications
                </Typography>
                {player.team.notifications &&
                player.team.notifications.length > 0 ? (
                  <NotificationsRow
                    notifications={temp_team_info.notifications}
                  />
                ) : (
                  <NoDataCard text="No notifications to show." />
                )}

                <Typography variant="h4" component="h2" gutterBottom>
                  Roster
                </Typography>
                <RosterTable
                  roster={player.team.roster}
                  captain={player.team.captainId}
                />

                <Typography variant="h4" component="h2" gutterBottom>
                  Upcoming Games
                </Typography>
                {player.team.schedule && player.team.schedule.length > 0 ? (
                  // adjust to display schedule games when its available
                  <GamesRow
                    games={temp_team_info.schedule.filter(
                      (game) => game.result === null
                    )}
                  />
                ) : (
                  <NoDataCard text="No games to show." />
                )}
                <Typography variant="h4" component="h2" gutterBottom>
                  Schedule
                </Typography>
                {player.team.schedule && player.team.schedule.length > 0 ? (
                  <ScheduleTable schedule={dummySchedule} />
                ) : (
                  <NoDataCard text="No schedule to show." />
                )}
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
