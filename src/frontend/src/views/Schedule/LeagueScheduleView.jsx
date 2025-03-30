import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { getPlayerById } from "../../api/player";
import { getScheduleBySeasonId } from "../../api/schedule";
import { formatDate } from "../../utils/Formatting";
import { Container, Typography, Box } from "@mui/material";

// Helper to normalize a date to local ISO (YYYY-MM-DD)
const getLocalISODate = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

// Add McMaster colours constant
const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

// Common loading overlay style for all schedule components
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

export const LeagueSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [seasonGames, setSeasonGames] = useState([]);

  // Helper functions defined before use
  const getMonthDates = (date) => {
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let firstWeekday = firstDayOfMonth.getDay();
    let totalDays = lastDayOfMonth.getDate();
    let daysArray = [];
    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(formatDate(new Date(date.getFullYear(), date.getMonth(), d)));
    }
    return daysArray;
  };

  // Combine data fetching into a single useEffect
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch player data
        const playerData = await getPlayerById(auth.playerId);
        setPlayer(playerData.player);

        // Fetch season games if player has a team with seasonId
        if (playerData.player?.team?.seasonId) {
          const scheduleData = await getScheduleBySeasonId(playerData.player.team.seasonId.id);
          
          // Filter games for current month
          const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
          const startISO = getLocalISODate(startOfMonth);
          const endISO = getLocalISODate(endOfMonth);

          const filteredGames = scheduleData.schedule.games.filter((game) => {
            const gameDate = getLocalISODate(new Date(game.date));
            return gameDate >= startISO && gameDate <= endISO;
          });
          
          setSeasonGames(filteredGames);
        }
      } catch (err) {
        console.error(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [auth.playerId, currentMonth]);

  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthDates = getMonthDates(currentMonth);

  // Navigation: change month
  const handleNavigation = (direction) => {
    setLoading(true);
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // For each day, filter all season games (normalized) that match this day
  const getMatchesForDay = (dayISO) => {
    if (!dayISO) return null;
    const matches = seasonGames.filter(
      (game) => formatDate(new Date(game.date)) === dayISO
    );
    if (matches.length === 0) return null;
    return matches.map((match, idx) => (
      <div key={idx} style={styles.matchText}>
        <div>{match.awayTeam.name} @ {match.homeTeam.name}</div>
        <div style={{ fontSize: '11px', marginTop: '2px', color: MCMASTER_COLOURS.maroon }}>
          {match.time} | {match.field}
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Navigation Header */}
      <div style={{
        ...styles.header,
        marginBottom: '30px'
      }}>
        <button style={{
          ...styles.navButton,
          backgroundColor: MCMASTER_COLOURS.maroon,
        }} onClick={() => handleNavigation("prev")}>
          Prev
        </button>
        <h2 style={styles.title}>{monthYear}</h2>
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
          <div style={{
            ...styles.calendar,
          }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{
                ...styles.calendarHeader,
              }}>
                {day}
              </div>
            ))}
            {monthDates.map((dayISO, idx) => (
              <div key={idx} style={dayISO ? styles.calendarCell : styles.emptyCell}>
                {dayISO && (
                  <div>
                    <div style={styles.dateText}>
                      {new Date(dayISO).getUTCDate()}
                    </div>
                    <div style={styles.matchesContainer}>
                      {getMatchesForDay(dayISO)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
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
  calendarHeader: {
    backgroundColor: MCMASTER_COLOURS.maroon,
    color: "white",
    textAlign: "center",
    padding: "12px",
    fontWeight: "500",
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
  },
  calendarCell: {
    backgroundColor: 'white',
    padding: '12px 8px',
    textAlign: 'center',
    minHeight: '120px',
    position: 'relative',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.lightGrey,
    },
  },
  emptyCell: {
    backgroundColor: '#f8f8f8',
    minHeight: '120px',
  },
  dateText: {
    fontWeight: "500",
    fontSize: "14px",
    color: MCMASTER_COLOURS.maroon,
    marginBottom: '8px',
  },
  matchesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
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
    '&:hover': {
      backgroundColor: MCMASTER_COLOURS.gold + '30',
      transform: 'translateY(-2px)',
      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
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

export default LeagueSchedule;
