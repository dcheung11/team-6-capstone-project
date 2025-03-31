import React, { useState, useEffect } from "react";
import ReschedulePopup from "../Reschedule/ReschedulePopup";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { getScheduleGamesByTeamId } from "../../api/team";
import { getAvailableGameslots } from "../../api/reschedule-requests";
import { formatDate, getLocalISODate } from "../../utils/Formatting";
import { MCMASTER_COLOURS } from "../../utils/Constants.js";


// Common loading overlay style
const loadingOverlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  fontWeight: 'bold',
  color: MCMASTER_COLOURS.maroon,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  zIndex: 1000,
};

// WeeklySchedule component: a weekly calendar view of the player's schedule
export const WeeklySchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState([]);
  const [availableGameslots, setAvailableGameslots] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch player data first
        const playerData = await getPlayerById(playerId);
        setPlayer(playerData.player);

        // If player has a team, fetch team games
        if (playerData.player?.team?.id) {
          const gamesData = await getScheduleGamesByTeamId(playerData.player.team.id);
          const weekDates = getWeekDates(currentDate);
          
          const filteredGames = gamesData.games.filter(game => {
            let gameDate = formatDate(game.date);
            return gameDate >= weekDates[0].fullDate && gameDate <= weekDates[6].fullDate;
          });
          
          setTeamGames(filteredGames);
        }

        // Fetch available gameslots
        const slotsResponse = await getAvailableGameslots();
        const formattedData = slotsResponse.reduce((acc, slot) => {
          const dateKey = formatDate(new Date(slot.date));
          const slotString = `${slot.time} | ${slot.field}`;
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({ id: slot._id, slotString: slotString });
          return acc;
        }, {});
        
        setAvailableGameslots(formattedData);

      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [playerId, currentDate]);

  useEffect(() => {
    if (!player?.team?.id) return;

    const weekDates = getWeekDates(currentDate);
    const filteredGames = teamGames.filter(game => {
      let gameDate = formatDate(game.date);
      return gameDate >= weekDates[0].fullDate && gameDate <= weekDates[6].fullDate;
    });

    setTeamGames(filteredGames);
  }, [currentDate, player?.team?.id]);

  const handleNavigation = (direction) => {
    setLoading(true);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  // Creates array Sunday-Saturday
  const getWeekDates = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    return [...Array(7)].map((_, i) => {
      let dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const fullDate = getLocalISODate(dayDate);
      return {
        day: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
        date: dayDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        fullDate,
      };
    });
  };

  // Display "Feb 23 - Mar 1, 2025"
  const getWeekRange = (date) => {
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const endStr = endOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const weekDates = getWeekDates(currentDate);

  const handleRescheduleClick = (dateKey, match) => {
    setSelectedDate(dateKey);
    setSelectedMatch(match);
    setShowModal(true);
  };

  return (
    <>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={{
          ...styles.navButton,
          backgroundColor: MCMASTER_COLOURS.maroon,
        }} onClick={() => handleNavigation("prev")}>
          Prev
        </button>
        <h2 style={styles.title}>
          {getWeekRange(currentDate)}
        </h2>
        <button style={{
          ...styles.navButton,
          backgroundColor: MCMASTER_COLOURS.maroon,
        }} onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      {/* Calendar Container with Loading Overlay */}
      <div style={{ position: 'relative', minHeight: '500px' }}>
        {loading && (
          <div style={loadingOverlayStyle}>
            <div style={styles.spinner}></div>
            <p>Loading games...</p>
          </div>
        )}

        {!loading && (
          <div style={styles.calendar}>
            {weekDates.map((wdate, index) => {
              const match = teamGames.find(game => {
                const gameDate = new Date(game.date);
                const gameDateStr = formatDate(gameDate);
                return gameDateStr === wdate.fullDate;
              });

              return (
                <div key={index} style={styles.calendarCard}>
                  <h4 style={styles.calendarDay}>{wdate.day}</h4>
                  <p style={styles.calendarDate}>{wdate.date}</p>
                  
                  {match ? (
                    <div style={styles.matchText}>
                      <div>{match.awayTeam.name} @ {match.homeTeam.name}</div>
                      <div style={{ 
                        fontSize: '11px', 
                        marginTop: '4px', 
                        color: MCMASTER_COLOURS.maroon,
                        opacity: 0.9
                      }}>
                        {match.time} | {match.field}
                      </div>
                      {player?.team?.captainId?.id === player._id && (
                        <button
                          style={styles.rescheduleButton}
                          onClick={() => handleRescheduleClick(wdate.fullDate, match)}
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  ) : (
                    <p style={styles.eventText}>No Matches</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ReschedulePopup modal */}
      {showModal && (
        Object.keys(availableGameslots).length > 0 ? (
          <ReschedulePopup
            selectedDate={selectedDate}
            selectedMatch={selectedMatch}
            availableTimeslots={availableGameslots}
            player={player}
            onClose={() => setShowModal(false)}
          />
        ) : (
          <div style={loadingOverlayStyle}>
            <div style={styles.spinner}></div>
            <p>Loading available timeslots...</p>
          </div>
        )
      )}
    </>
  );
};

export default WeeklySchedule;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    marginBottom: '30px',
  },
  
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: MCMASTER_COLOURS.maroon,
  },
  
  navButton: {
    backgroundColor: MCMASTER_COLOURS.maroon,
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: '#5A002C',
    }
  },
  
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "1px",
    width: '100%',
    backgroundColor: MCMASTER_COLOURS.grey + '20',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  },
  
  calendarCard: {
    backgroundColor: 'white',
    padding: '12px 8px',
    textAlign: 'center',
    minHeight: '120px',
    position: 'relative',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.lightGrey + '30',
    },
  },
  
  calendarDay: {
    margin: '0 0 4px 0',
    color: MCMASTER_COLOURS.maroon,
    fontWeight: "500",
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
  },
  
  calendarDate: {
    margin: '0 0 12px 0',
    color: MCMASTER_COLOURS.grey,
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  
  eventText: {
    fontSize: '12px',
    color: MCMASTER_COLOURS.grey,
    fontWeight: '500',
    margin: '0',
  },
  
  matchText: {
    fontSize: '12px',
    color: MCMASTER_COLOURS.grey,
    fontWeight: '500',
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: MCMASTER_COLOURS.lightGrey,
    border: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    margin: '0',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.gold + '30',
      transform: 'translateY(-2px)',
      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
    },
  },
  
  rescheduleButton: {
    backgroundColor: MCMASTER_COLOURS.gold + '90',
    color: MCMASTER_COLOURS.maroon,
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '11px',
    marginTop: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.gold,
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
  
  spinner: {
    width: '30px',
    height: '30px',
    border: `4px solid ${MCMASTER_COLOURS.gold}`,
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};
