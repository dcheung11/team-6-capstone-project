import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleGamesByTeamId } from "../api/team";
import { formatDate } from "../utils/Formatting";

const getLocalISODate = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export const TeamSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [teamGames, setTeamGames] = useState([]);

  // Fetch player info on mount
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        const data = await getPlayerById(auth.playerId);
        setPlayer(data.player);
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [auth.playerId]);

  // Fetch team games for the current month
  useEffect(() => {
    const fetchTeamGames = async () => {
      if (!player?.team?.id) return;
      try {
        setLoading(true);
        const data = await getScheduleGamesByTeamId(player.team.id);
        // Define start and end dates for the current month (ISO format)
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startISO = getLocalISODate(startOfMonth);
        const endISO = getLocalISODate(endOfMonth);

        const filteredGames = data.games.filter((game) => {
          // const gameDate = formatDate(game.date); // Assuming this returns "YYYY-MM-DD"
          const gameDate = getLocalISODate(game.date); // might need to adjust this
          return gameDate >= startISO && gameDate <= endISO;
        });
        setTeamGames(filteredGames);
      } catch (err) {
        setError(err.message || "Failed to fetch team schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamGames();
  }, [player, currentMonth]);

  // Navigation: change month
  const handleNavigation = (direction) => {
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // Get month-year for display
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Generate an array for the current month's calendar cells (include empty cells for alignment)
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

  const monthDates = getMonthDates(currentMonth);

  // For each day, get game(s) scheduled on that day.
  const getMatchesForDay = (dayISO) => {
    if (!dayISO) return null;
    const matches = teamGames.filter((game) => formatDate(game.date) === dayISO);
    if (matches.length === 0) return null;
    return matches.map((match, idx) => (
      <div key={idx} style={styles.matchText}>
        {match.awayTeam.name} @ {match.homeTeam.name} {match.time} | {match.field}
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>
          Prev
        </button>
        <h2 style={styles.title}>{loading ? "Loading..." : monthYear}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      {loading && <p>Loading schedule...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Monthly Calendar Grid */}
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
                  <div style={styles.dateText}>{new Date(dayISO).getUTCDate()}</div>
                  {getMatchesForDay(dayISO)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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
    fontSize: "12px",
    color: "#7A003C",
    fontWeight: "bold",
    marginTop: "5px",
  },
};

export default TeamSchedule;
