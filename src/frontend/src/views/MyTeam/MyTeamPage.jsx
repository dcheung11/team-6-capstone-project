// Author: Damien Cheung, Emma Wigglesworth
// Description: Page for displaying the player's team information, including schedule, notifications, and roster.
// Last Modified: 2025-03-28

import {
  Typography,
  Container,
  Box,
  Tab,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import RosterTable from "../../components/Tables/RosterTable";
import ScheduleTable from "../../components/Tables/ScheduleTable";
import NotificationsRow from "../../components/Rows/NotificationsRow";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { getNotificationsByTeamId } from "../../api/notification";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NoDataCard from "../../components/Cards/NoDataCard";
import { useNavigate, useParams } from "react-router-dom";
import { getScheduleGamesByTeamId } from "../../api/team";
import LoadingOverlay from "../../components/LoadingOverlay";
import ContactInfoTable from "../../components/Tables/ContactInfoTable";
import { removePlayerFromRoster } from "../../api/team";
import { MCMASTER_COLOURS } from "../../utils/Constants";

// MyTeamPage: This component displays the player's team information,
// including schedule, notifications, and roster. Captains have submit score and
// invite player permissions.

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

  // handle change teams (future use for when we allow multiple teams)
  const handleChange = (event, newValue) => {
    setTeamTabValue(newValue);
    if (newValue !== "contacts") {
      navigate(`/team/${newValue}`);
    }
  };

  // Fetch player data by ID
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

  // Fetch schedule games and notifications by team ID
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

  // Fetch notifications by team ID
  useEffect(() => {
    if (!player || teamTabValue === "contacts") return;

    const fetchNotificationsByTeamId = async (tid) => {
      try {
        const data = await getNotificationsByTeamId(tid);
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

  // Handle leaving the team
  const handleLeaveTeam = async () => {
    if (!playerId || !teamTabValue) return;

    try {
      setLoading(true);
      await removePlayerFromRoster(teamTabValue, playerId);
      navigate("/home"); // or another route after leaving
    } catch (err) {
      setError(err.message || "Failed to leave team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: MCMASTER_COLOURS.lightGrey,
        minHeight: "100vh",
        height: "100%",
        position: "fixed",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          My Team
        </Typography>

        {loading ? (
          <LoadingOverlay loading={loading} />
        ) : player && player.team ? (
          <>
            <TabContext value={teamTabValue}>
              {player.team?.captainId?.id === playerId && ( // Only show tabs for captains
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  {/* AI Generated - Tablist styling */}
                  <TabList
                    onChange={handleChange}
                    sx={{
                      "& .Mui-selected": {
                        color: `${MCMASTER_COLOURS.maroon} !important`,
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: MCMASTER_COLOURS.maroon,
                      },
                    }}
                  >
                    <Tab label={player?.team?.name} value={player?.team?.id} />
                    <Tab label="Captain Contacts" value="contacts" />
                  </TabList>
                </Box>
              )}

              <TabPanel value={player.team?.id}>
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      color: MCMASTER_COLOURS.maroon,
                      fontWeight: 700,
                      fontSize: { xs: "2.5rem", md: "3rem" },
                      mb: 1,
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                    }}
                  >
                    {player.team?.name}
                    {player.team?.captainId?.id === playerId && (
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
                      bgcolor: "white",
                      p: { md: 3 },
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        // AI Generated - Ombre bar styling and gradient effects
                        background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
                        borderRadius: "2px 2px 0 0",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: `linear-gradient(to right, ${MCMASTER_COLOURS.gold}, ${MCMASTER_COLOURS.maroon})`,
                        borderRadius: "0 0 2px 2px",
                      },
                      "& .stat-label": {
                        color: MCMASTER_COLOURS.grey,
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      },
                      "& .stat-value": {
                        fontSize: "1.1rem",
                        fontWeight: 500,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">Season:</Typography>
                      <Typography className="stat-value">
                        {player.team?.seasonId?.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">Division:</Typography>
                      <Typography className="stat-value">
                        {player.team?.divisionId?.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography className="stat-label">
                        Record (W/D/L):
                      </Typography>
                      <Typography className="stat-value">
                        {player.team.wins}-{player.team.draws}-
                        {player.team.losses}
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
                        Rescheduling Notifications
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
                    Previous Games
                  </Typography>
                  {teamGames &&
                  teamGames.games &&
                  teamGames.games.length > 0 ? (
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

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: "2rem",
                        fontWeight: 700,
                      }}
                    >
                      Roster
                    </Typography>

                    {player.team.captainId.id !== playerId && ( // Only show button if the player is not the captain
                      <Button
                        variant="contained"
                        onClick={handleLeaveTeam}
                        disabled={loading}
                        sx={{
                          backgroundColor: MCMASTER_COLOURS.maroon,
                          color: "white",
                          padding: "8px 24px",
                          borderRadius: "6px",
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: MCMASTER_COLOURS.maroon + "E6",
                          },
                        }}
                      >
                        Leave Team
                      </Button>
                    )}
                  </Stack>

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
                        "&:hover": {
                          bgcolor: "#5A002C",
                        },
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
                        mb: 2,
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
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: "2rem", md: "2rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
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
