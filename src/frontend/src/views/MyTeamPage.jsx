import { Typography, Container, Box } from "@mui/material";
import NavBar from "../components/NavBar";
import RosterTable from "../components/RosterTable";
import ScheduleTable from "../components/ScheduleTable";
import GamesRow from "../components/GamesRow";
import NotificationsRow from "../components/NotificationsRow";
import temp_team_info from "../data/team.json";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { useEffect, useState } from "react";
import NoTeamsCard from "../components/NoTeamsCard";

export default function MyTeamPage() {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId, setPlayerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        const data = await getPlayerById(pid);
        setPlayer(data);
        console.log("Upcoming Seasons:", data);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, []);

  const columns = [
    { header: "Date", key: "date" },
    { header: "Opposing Team", key: "team" },
    { header: "Result", key: "result" },
    { header: "Score", key: "score" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Teams
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 6, gap: 4 }}>
          {/* placeholder until teams are implemented */}
          {player && player.team ? (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Team Information
              </Typography>
              <Typography variant="body1">
                Team Name: {player.team.name}
              </Typography>
              <Typography variant="body1">
                Team Record: {player.team.record}
              </Typography>
              <img
                src={temp_team_info.team_logo}
                alt="Team Logo"
                width={200}
                height={200}
                className="rounded-full"
              />
              <Typography variant="h3" component="h1" gutterBottom>
                {temp_team_info.team_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Record (W/D/L)
              </Typography>
              <Typography variant="body1">
                {temp_team_info.team_record}
              </Typography>
              {/* TODO: For captains */}
              {/* <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#800020",
                "&:hover": {
                  bgcolor: "#600018",
                },
              }}
            >
              Invite Players
            </Button> */}
            </Box>
          ) : (
            <NoTeamsCard />
          )}
        </Box>

        {/* For captain view */}
        <Typography variant="h4" component="h2" gutterBottom>
          Notifications
        </Typography>
        <NotificationsRow notifications={temp_team_info.notifications} />

        <Typography variant="h4" component="h2" gutterBottom>
          Roster
        </Typography>
        <RosterTable players={temp_team_info.roster} />

        <Typography variant="h4" component="h2" gutterBottom>
          Upcoming Games
        </Typography>
        <GamesRow
          games={temp_team_info.schedule.filter((game) => game.result === null)}
        />

        <Typography variant="h4" component="h2" gutterBottom>
          Games
        </Typography>
        <ScheduleTable columns={columns} data={temp_team_info.schedule} />

        {/* TODO - add submit score for captain */}
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#800020",
              "&:hover": {
                bgcolor: "#600018",
              },
            }}
          >
            Submit Score
          </Button>
        </Box> */}
      </Container>
    </div>
  );
}
