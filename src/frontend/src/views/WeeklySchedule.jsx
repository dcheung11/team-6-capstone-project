import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import ReschedulePopup from "./ReschedulePopup";
import NoDataCard from "../components/NoDataCard";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";

const getLocalISODate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized.toISOString().split("T")[0];
};

export const WeeklySchedule = () => {
  const auth = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState([]);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const fetchTeamGames = async () => {
    if (!player?.team?.id) return;

    try {
      setLoading(true);
      const data = await getScheduleGamesByTeamId(player.team.id);
      const weekDates = getWeekDates(currentDate);

      const filteredGames = data.games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate >= weekDates[0].dateObj && 
              gameDate <= weekDates[6].dateObj &&
              gameDate.getDay() !== 0 && // Sunday
              gameDate.getDay() !== 6;  // Saturday
      });

      setTeamGames(filteredGames);
    } catch (err) {
      setError(err.message || "Failed to fetch team schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const data = await getPlayerById(auth.playerId);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player data");
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [auth.playerId]);

  useEffect(() => {
    if (player?.team?.id) {
      fetchTeamGames();
    }
  }, [player, currentDate]);

  const handleNavigation = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const getWeekDates = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    return Array.from({ length: 7 }).map((_, i) => {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      return {
        weekday: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
        dateString: dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        isoDate: getLocalISODate(dayDate),
        dateObj: dayDate,
        isWeekend: [0, 6].includes(dayDate.getDay())
      };
    });
  };

  const getWeekRange = () => {
    const dates = getWeekDates(currentDate);
    return `Week of ${dates[0].dateString} - ${dates[6].dateString}, ${currentDate.getFullYear()}`;
  };

  const handleReschedule = (game) => {
    setSelectedGame(game);
    setShowReschedule(true);
  };

  if (error) return <NoDataCard text={error} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        gap: 2
      }}>
        <Button 
          variant="contained"
          sx={{
            bgcolor: '#7A003C',
            '&:hover': { bgcolor: '#600030' },
            minWidth: '160px'
          }}
          onClick={() => handleNavigation("prev")}
        >
          Previous Week
        </Button>
        
        <Typography variant="h4" component="h2" sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          textAlign: 'center'
        }}>
          {getWeekRange()}
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: '#7A003C',
            '&:hover': { bgcolor: '#600030' },
            minWidth: '160px'
          }}
          onClick={() => handleNavigation("next")}
        >
          Next Week
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
        mb: 4,
        '@media (max-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' },
        '@media (max-width: 800px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
        '@media (max-width: 600px)': { gridTemplateColumns: '1fr' }
      }}>
        {getWeekDates(currentDate).map((day, index) => (
          <Box 
            key={index} 
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              minHeight: '200px',
              backgroundColor: day.isWeekend ? '#f8f9fa' : 'white'
            }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center'
            }}>
              {day.weekday}
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              mb: 2
            }}>
              {day.dateString}
            </Typography>

            {day.isWeekend ? (
              <Typography variant="body2" sx={{ 
                textAlign: 'center',
                color: 'text.disabled',
                fontStyle: 'italic'
              }}>
                No Games Scheduled
              </Typography>
            ) : (
              teamGames.filter(game => 
                getLocalISODate(new Date(game.date)) === day.isoDate
              ).length > 0 ? (
                teamGames
                  .filter(game => getLocalISODate(new Date(game.date)) === day.isoDate)
                  .map((game, gameIndex) => (
                    <Box key={gameIndex} sx={{ 
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}>
                      <Typography variant="body2">
                        {game.homeTeam.name} vs {game.awayTeam.name}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(game.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {game.field}
                      </Typography>
                      {player?.team?.captainId?.id === auth.playerId && (
                        <Button
                          size="small"
                          sx={{
                            mt: 1,
                            bgcolor: '#FFC72C',
                            color: '#7A003C',
                            '&:hover': { bgcolor: '#FFB800' },
                            fontWeight: 'bold'
                          }}
                          onClick={() => handleReschedule(game)}
                        >
                          Reschedule
                        </Button>
                      )}
                    </Box>
                  ))
              ) : (
                <Typography variant="body2" sx={{ 
                  textAlign: 'center',
                  color: 'text.disabled',
                  mt: 2
                }}>
                  No Matches
                </Typography>
              )
            )}
          </Box>
        ))}
      </Box>

      {showReschedule && (
        <ReschedulePopup
          game={selectedGame}
          open={showReschedule}
          onClose={() => setShowReschedule(false)}
          onRescheduleSuccess={() => {
            fetchTeamGames();
            setShowReschedule(false);
          }}
        />
      )}
    </Container>
  );
};

export default WeeklySchedule;