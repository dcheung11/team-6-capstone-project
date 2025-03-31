import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { WeeklySchedule } from "./WeeklySchedule";
import { TeamSchedule } from "./TeamScheduleView";
import { LeagueSchedule } from "./LeagueScheduleView";
import { CommissionerSchedule } from "./CommissionerSchedulePage";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { 
  Container, 
  Typography, 
  Box, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel,
} from "@mui/material";
import LoadingOverlay from "../../components/LoadingOverlay";
import { MCMASTER_COLOURS } from "../../utils/Constants.js";

// ScheduleView component: Main component for displaying the schedule view
// It fetches the player data and conditionally renders the schedule based on the player's role
// Players can choose between weekly, team (monthly), and league views
const ScheduleView = () => {
  const [activeView, setActiveView] = useState("weekly");
  const auth = useAuth();
  const [playerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch player data by ID and set the active view based on the player's role
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
        if (data.player.role === "commissioner") {
          setActiveView("commissioner");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, [playerId]);

  if (loading || !player) {
    return (
      <Box sx={{ bgcolor: MCMASTER_COLOURS.lightGrey, minHeight: '100vh' }}>
        <NavBar />
        <LoadingOverlay loading={loading} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: MCMASTER_COLOURS.lightGrey,
      }}
    >
      <NavBar />
      <Container sx={{ py: 4, flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(to right, ${MCMASTER_COLOURS.maroon}, ${MCMASTER_COLOURS.gold})`,
              borderRadius: '2px 2px 0 0'
            },
            p: 3,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold",
              color: MCMASTER_COLOURS.maroon,
              mb: 3
            }}
          >
            Schedule
          </Typography>

          {player.role !== "commissioner" && !player.team ? (
            // No team message
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                bgcolor: MCMASTER_COLOURS.lightGrey + '30',
                borderRadius: 2,
                border: `1px dashed ${MCMASTER_COLOURS.grey}40`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: MCMASTER_COLOURS.maroon,
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Join a Team to View Schedules
              </Typography>
              <Typography
                sx={{
                  color: MCMASTER_COLOURS.grey,
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: 1.6
                }}
              >
                To view game schedules, you'll need to be part of a team. 
                Register your own team or accept a team invitation to get started.
              </Typography>
            </Box>
          ) : (
            // Regular schedule view for players with teams
            <>
              {player.role !== "commissioner" && (
                <FormControl
                  sx={{
                    mb: 4,
                    minWidth: 220,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: MCMASTER_COLOURS.maroon,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: MCMASTER_COLOURS.maroon,
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: MCMASTER_COLOURS.maroon,
                    }
                  }}
                >
                  <InputLabel id="view-select-label">View</InputLabel>
                  <Select
                    labelId="view-select-label"
                    value={activeView}
                    label="View"
                    onChange={(e) => setActiveView(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                    }}
                  >
                    <MenuItem 
                      value="weekly"
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                          '&:hover': {
                            backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                        }
                      }}
                    >
                      Weekly Schedule
                    </MenuItem>
                    <MenuItem 
                      value="team"
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                          '&:hover': {
                            backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                        }
                      }}
                    >
                      Monthly Schedule
                    </MenuItem>
                    <MenuItem 
                      value="league"
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}14`,
                          '&:hover': {
                            backgroundColor: `${MCMASTER_COLOURS.maroon}20`,
                          }
                        },
                        '&:hover': {
                          backgroundColor: `${MCMASTER_COLOURS.maroon}0A`,
                        }
                      }}
                    >
                      League Schedule
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Schedule Components */}
              {activeView === "weekly" && <WeeklySchedule />}
              {activeView === "team" && <TeamSchedule />}
              {activeView === "league" && <LeagueSchedule />}
              {activeView === "commissioner" && <CommissionerSchedule />}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ScheduleView;