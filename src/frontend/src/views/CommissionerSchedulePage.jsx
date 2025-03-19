import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";
import { getScheduleBySeasonId } from "../api/schedule";
import { getOngoingSeasons, getUpcomingSeasons } from "../api/season";
import { formatDate } from "../utils/Formatting";
import { Typography, Container, Box, Tab, Stack, Button } from "@mui/material";
import { getAvailableGameslots } from "../api/reschedule-requests";

// Helper to normalize a date to local ISO (YYYY-MM-DD)
const getLocalISODate = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

export const CommissionerSchedule = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const [player, setPlayer] = useState(null);
  const [seasonGames, setSeasonGames] = useState([]);
  const [availableGameslots, setAvailableGameslots] = useState({});

  // Fetch player info
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

    // Fetch season schedule (all games) using player's team seasonId
    useEffect(() => {
    const fetchSeasonGames = async () => {
        try {
        setLoading(true);
        let seasonData = await getOngoingSeasons();
        if (!seasonData) {
            seasonData = await getUpcomingSeasons();
        }
        if (!seasonData) {
            throw new Error("No ongoing or upcoming seasons found");
        }
        else if (!seasonData.seasons[0].schedule) {
            setSeasonGames([]);
        }
        else {
            setSeasonGames(seasonData.seasons[0].schedule.games);
        }
        } catch (err) {
        setError(err.message || "Failed to fetch season schedule");
        } finally {
        setLoading(false);
        }
    };
    fetchSeasonGames();
    }, [player]);

    useEffect(() => {
      const fetchGameslots = async () => {
        setLoading(true);
        setError(null);
        try {
            // this gets the available gameslots in this year
            const response = await getAvailableGameslots();

            // Transform data into { "YYYY-MM-DD": ["Time | Field"] } format
            const formattedData = response.reduce((acc, slot) => {
              const dateKey = formatDate(new Date(slot.date));
              const slotString = `${slot.time} | ${slot.field}`;
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push({ id: slot._id, slotString: slotString });
              return acc;
            }, {});

            setAvailableGameslots(formattedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
      };

      fetchGameslots();
    }, []);

  // Navigation: change month
  const handleNavigation = (direction) => {
    let newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentMonth(newDate);
  };

  // Display month and year
  const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Generate calendar cells for the current month using local ISO dates
  const getMonthDates = (date) => {
    let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let firstWeekday = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    let totalDays = lastDayOfMonth.getDate();
    let daysArray = [];
    // Empty cells before first day
    for (let i = 0; i < firstWeekday; i++) {
      daysArray.push(null);
    }
    // Each day as local ISO date string
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(formatDate(new Date(date.getFullYear(), date.getMonth(), d)));
    }
    return daysArray;
  };

  const monthDates = getMonthDates(currentMonth);

  // For each day, filter all season games (normalized) that match this day
  const getMatchesForDay = (dayISO) => {
    if (!dayISO) return null;
    const matches = seasonGames.filter(
      (game) => formatDate(new Date(game.date)) === dayISO
    );
    if (matches.length === 0) return null;
    return matches.map((match, idx) => (
      <Button
        key={idx}
        variant="outlined"
        sx={{
          color: "#7A003C",
          borderColor: "#7A003C",

          margin: "5px 0",
          '&:hover': {
            backgroundColor: "#f2e1e8",
            borderColor: "#7A003C"
          }
        }}
      >
        {match.awayTeam.name} @ {match.homeTeam.name} ({match.time} | {match.field})
      </Button>
    ));
  };

  const getSlotsForDay = (dayISO) => {
    if (!dayISO) return null;

    const slots = availableGameslots[formatDate(dayISO)] || [];
    // console.log("availableGameslots", dayISO, slots);
    if (slots.length > 0) {
      // console.log("this ran", slots);
      slots.push(...availableGameslots[formatDate(dayISO)]);
    }
    else {
      return null;
    }
    
    console.log("Slots: ", slots[0].slotString);

    return slots.map((slot, idx) => (
      <Button
        key={idx}
        variant="outlined"
        sx={{
          color: "#7A003C",
          borderColor: "#7A003C",

          margin: "5px 0",
          '&:hover': {
            backgroundColor: "#f2e1e8",
            borderColor: "#7A003C"
          }
        }}
      >
       {slot.slotString}
      </Button>
    ));
  };

  return (
    <div style={styles.container}>
      {/* Navigation Header */}
      <div style={styles.header}>
        <button style={styles.navButton} onClick={() => handleNavigation("prev")}>
          Prev
        </button>
        <h2 style={styles.title}>{monthYear}</h2>
        <button style={styles.navButton} onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      {loading && <p>Loading schedule...</p>}

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
                  {getSlotsForDay(dayISO)}
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

export default CommissionerSchedule;