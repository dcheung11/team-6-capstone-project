import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";
import { formatDate } from "../utils/Formatting";
import ReschedulePopup from "./ReschedulePopup";
import { getAvailableGameslots } from "../api/reschedule-requests";

const getLocalISODate = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

const MCMASTER_COLOURS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

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

export const TeamSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [availableGameslots, setAvailableGameslots] = useState({});

  // Move getMonthDates function before it's used
  const getMonthDates = (date) => {
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let firstWeekday = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    let totalDays = lastDayOfMonth.getDate();
    let daysArray = [];
    // Add empty cells for days before the first day
    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push(null);
    }
    // Add each day as an ISO date string
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(formatDate(new Date(date.getFullYear(), date.getMonth(), d)));
    }
    return daysArray;
  };

  // Now we can safely use getMonthDates
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const monthDates = getMonthDates(currentMonth);

  // Combine all data fetching into a single useEffect
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch player data
        const playerData = await getPlayerById(auth.playerId);
        setPlayer(playerData.player);

        // Fetch team games if player has a team
        if (playerData.player?.team?.id) {
          const gamesData = await getScheduleGamesByTeamId(playerData.player.team.id);
          
          // Filter games for current month
          const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
          const startISO = getLocalISODate(startOfMonth);
          const endISO = getLocalISODate(endOfMonth);

          const filteredGames = gamesData.games.filter((game) => {
            const gameDate = getLocalISODate(game.date);
            return gameDate >= startISO && gameDate <= endISO;
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
  }, [auth.playerId, currentMonth]); // Only depend on playerId and currentMonth

  // Navigation: change month
  const handleNavigation = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // Add handler for reschedule clicks
  const handleRescheduleClick = (dateKey, match) => {
    setSelectedDate(dateKey);
    setSelectedMatch(match);
    setShowModal(true);
  };

  // Modify the getMatchesForDay function to include the reschedule button
  const getMatchesForDay = (dayISO) => {
    if (!dayISO) return null;
    const matches = teamGames.filter((game) => formatDate(game.date) === dayISO);
    if (matches.length === 0) return null;
    return matches.map((match, idx) => (
      <div key={idx} style={styles.matchText}>
        <div>{match.awayTeam.name} @ {match.homeTeam.name}</div>
        <div style={{ fontSize: '11px', marginTop: '2px', color: MCMASTER_COLOURS.maroon }}>
          {match.time} | {match.field}
        </div>
        {player?.team?.captainId?.id === player._id && (
          <button
            style={styles.rescheduleButton}
            onClick={() => handleRescheduleClick(dayISO, match)}
          >
            Reschedule
          </button>
        )}
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
          <div style={styles.calendar}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={styles.calendarHeader}>
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

export default TeamSchedule;
