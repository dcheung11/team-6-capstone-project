import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { WeeklySchedule } from "./WeeklySchedule";
import { TeamSchedule } from "./TeamScheduleView";
import { LeagueSchedule } from "./LeagueScheduleView";
import { CommissionerSchedule } from "./CommissionerSchedulePage";
import { useAuth } from "../hooks/AuthProvider";
import { getPlayerById } from "../api/player";

const ScheduleView = () => {
  // Set activeSchedule initially to null so nothing is rendered until determined
  const [activeSchedule, setActiveSchedule] = useState(null);
  const auth = useAuth();
  const [playerId] = useState(auth.playerId);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Combined effect to fetch player data and determine activeSchedule based on role
  useEffect(() => {
    const fetchPlayerById = async (pid) => {
      try {
        setLoading(true);
        const data = await getPlayerById(pid);
        setPlayer(data.player);
        // Immediately set activeSchedule based on player role
        if (data.player.role === "commissioner") {
          setActiveSchedule("commissioner");
        } else {
          setActiveSchedule("weekly");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch player");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerById(playerId);
  }, [playerId]);

  if (loading || activeSchedule === null) {
    return (null);
  }

  return (
    <div>
      <NavBar />
      <div style={styles.container}>
        {/* Toggle Buttons for non-commissioners */}
        {player.role !== "commissioner" ? (
          <div style={styles.toggleContainer}>
            <button
              style={activeSchedule === "weekly" ? styles.activeToggle : styles.toggleButton}
              onClick={() => setActiveSchedule("weekly")}
            >
              Weekly Schedule
            </button>
            <button
              style={activeSchedule === "team" ? styles.activeToggle : styles.toggleButton}
              onClick={() => setActiveSchedule("team")}
            >
              Team Schedule
            </button>
            <button
              style={activeSchedule === "league" ? styles.activeToggle : styles.toggleButton}
              onClick={() => setActiveSchedule("league")}
            >
              League Schedule
            </button>
          </div>
        ) : (
          <div style={{ ...styles.toggleContainer, textAlign: "center" }}>
            <div>
              <h1>League Schedule</h1>
              <p>Select two games/timeslots and click submit below to swap</p>
            </div>
          </div>
        )}
        {/* Display the Selected Schedule */}
        {activeSchedule === "weekly" && <WeeklySchedule />}
        {activeSchedule === "team" && <TeamSchedule />}
        {activeSchedule === "league" && <LeagueSchedule />}
        {activeSchedule === "commissioner" && <CommissionerSchedule />}
      </div>
    </div>
  );
};

// Styles remain unchanged
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#7A003C",
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  toggleButton: {
    backgroundColor: "#FFC72C",
    color: "#7A003C",
    border: "none",
    padding: "10px 15px",
    margin: "0 5px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  activeToggle: {
    backgroundColor: "#7A003C",
    color: "white",
    border: "none",
    padding: "10px 15px",
    margin: "0 5px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ScheduleView;