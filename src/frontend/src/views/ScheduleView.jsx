import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { WeeklySchedule } from "./WeeklySchedule";
import { TeamSchedule } from "./TeamScheduleView";
import { LeagueSchedule } from "./LeagueScheduleView";

const ScheduleView = () => {
  const [activeSchedule, setActiveSchedule] = useState("weekly");

  return (
	<div>
		<NavBar />
		<div style={styles.container}>
			{/* Toggle Buttons */}
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
			{/* Display the Selected Schedule */}
			{activeSchedule === "weekly" && <WeeklySchedule />}
			{activeSchedule === "team" && <TeamSchedule />}
			{activeSchedule === "league" && <LeagueSchedule />}
		</div>
	</div>
    
  );
};

// Styles
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