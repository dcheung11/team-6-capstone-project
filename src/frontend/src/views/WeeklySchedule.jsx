import React, { useState, useEffect } from "react";
import ReschedulePopup from "./ReschedulePopup";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";
import { getAvailableGameslots } from "../api/reschedule-requests";
import { formatDate } from "../utils/Formatting";

const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

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

// Fix the "day ahead" issue by normalizing date/time
function getLocalISODate(date) {
  date.setHours(12, 0, 0, 0);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

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
  const weekRange = getWeekRange(currentDate);

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
                      <div style={{ fontSize: '11px', marginTop: '2px', color: MCMASTER_COLOURS.maroon }}>
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
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#7A003C",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    color: MCMASTER_COLOURS.maroon,
  },
  navButton: {
    backgroundColor: "#7A003C",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "15px",
    marginBottom: "20px",
  },
  calendarCard: {
    border: "1px solid #D3D3D3",
    borderRadius: "5px",
    padding: "10px",
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    position: "relative",
  },
  calendarDay: {
    fontWeight: "bold",
    color: "#7A003C",
  },
  calendarDate: {
    fontSize: "14px",
    color: "#4F4F4F",
  },
  eventText: {
    fontSize: "14px",
    color: "#7A003C",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  matchText: {
    fontSize: '12px',
    color: MCMASTER_COLOURS.grey,
    fontWeight: 'bold',
    padding: '6px',
    borderRadius: '4px',
    backgroundColor: MCMASTER_COLOURS.lightGrey,
    border: `1px solid ${MCMASTER_COLOURS.maroon}`,
    transition: 'all 0.2s ease',
    marginTop: '8px',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.gold,
      transform: 'translateY(-2px)',
    },
  },
  rescheduleButton: {
    backgroundColor: MCMASTER_COLOURS.gold,
    color: MCMASTER_COLOURS.maroon,
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '11px',
    marginTop: '5px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#e6a800',
    },
  },
  loadingOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#7A003C",
    display: "flex",          // Added for centering
    flexDirection: "column",  // Stack spinner & text
    alignItems: "center",     // Center horizontally
    justifyContent: "center", // Center vertically
    gap: "10px",              // Space between spinner & text
    zIndex: 1000,
  },
  spinner: { width: "30px", height: "30px", border: "4px solid #FFC72C", borderTop: "4px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" },
};
