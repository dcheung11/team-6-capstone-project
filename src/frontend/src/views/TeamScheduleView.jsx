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
          <div style={{
            ...styles.calendar,
            border: `1px solid ${MCMASTER_COLOURS.maroon}`,
          }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} style={{
                ...styles.calendarHeader,
                backgroundColor: MCMASTER_COLOURS.maroon,
              }}>
                {day}
              </div>
            ))}
            {monthDates.map((dayISO, idx) => (
              <div key={idx} style={dayISO ? {
                ...styles.calendarCell,
                border: `1px solid ${MCMASTER_COLOURS.maroon}`,
              } : styles.emptyCell}>
                {dayISO && (
                  <div>
                    <div style={{
                      ...styles.dateText,
                      color: MCMASTER_COLOURS.maroon,
                    }}>{new Date(dayISO).getUTCDate()}</div>
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
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
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
    gap: "2px",
    border: "1px solid #7A003C",
  },
  calendarHeader: {
    backgroundColor: "#7A003C",
    color: "white",
    textAlign: "center",
    padding: "10px",
    fontWeight: "bold",
  },
  calendarCell: {
    border: "1px solid #7A003C",
    padding: "10px",
    textAlign: "center",
    minHeight: "80px",
    position: "relative",
  },
  emptyCell: {
    border: "1px solid #D3D3D3",
    backgroundColor: "#E0E0E0",
    minHeight: "80px",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#7A003C",
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
    backgroundColor: "#FFC72C",
    color: "#7A003C",
    border: "none",
    padding: "4px 8px",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "11px",
    marginTop: "5px",
  },
  spinner: {
    width: "30px",
    height: "30px",
    border: "4px solid #FFC72C",
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default TeamSchedule;
