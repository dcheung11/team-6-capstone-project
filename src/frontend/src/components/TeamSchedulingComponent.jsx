// Author: Damien Cheung
// Description: The TeamSchedulingComponent component is responsible for managing the scheduling of teams in a season.
// It allows the commissioner to set divisions, generate schedules, and launch seasons. Used in Management Page.
// Last Modified: 2025-02-28

import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import TeamTable from "./Tables/TeamTable";
import { DivisionCard } from "./Cards/DivisionCard";
import {
  launchSeason,
  removeTeamFromSeason,
  updateSeasonDivisionTeams,
} from "../api/season";
import { generateSchedule, getScheduleBySeasonId } from "../api/schedule";
import ScheduleTable from "./Tables/ScheduleTable";
import LoadingOverlay from "./LoadingOverlay";

// TeamSchedulingComponent: A component for managing team scheduling, including setting divisions, generating schedules, and launching seasons.
export default function TeamSchedulingComponent(props) {
  const [divisionsSet, setDivisionsSet] = useState(false);
  const [schedule, setSchedule] = useState(null);

  // Used for commissioner to set divisions before generating schedule
  const [tempTeams, setTempTeams] = useState([...props.registeredTeams]);
  const [tempDivisions, setTempDivisions] = useState(props.divisions);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Function to generate temporary divisions based on the registered teams, this is the
  // value displayed in the editable dropdown in the Manage Upcoming Seasons tab
  function generateTempDivision(divisions, teams) {
    const tempDivisions = divisions.map((division) => {
      const divisionTeams = teams.filter(
        (team) => team.division === division.id
      );
      return { ...division, teams: divisionTeams };
    });

    return tempDivisions;
  }

  // Update tempDivisions when registeredTeams change
  useEffect(() => {
    setTempDivisions(
      generateTempDivision(tempDivisions, props.registeredTeams)
    );
  }, [props.registeredTeams]);

  // Get the unchanging preferred division of a team
  const getPreferredDivision = (refTeam) => {
    const team = props.registeredTeams.filter(
      (team) => team.name === refTeam.name
    )[0];
    return team && team.division ? team.division : null;
  };

  // Get the teams in a division
  const calculateDivisionTeams = (division) => {
    return props.registeredTeams.filter((team) => team.division === division);
  };

  // Set divisions for the season
  const handleSetDivisions = () => {
    const updateDivisionTeams = async (seasonId, divisionTeams) => {
      try {
        setLoading(true);
        await updateSeasonDivisionTeams(seasonId, divisionTeams);
        setDivisionsSet(true);
      } catch (err) {
        setLoading(false);
        setError(err.message || "Failed to update division teams");
      } finally {
        setLoading(false);
      }
    };

    const divisionTeamsRequestBody = [];
    props.divisions.forEach((division) => {
      divisionTeamsRequestBody.push({ id: division.id, teams: [] });
    });
    tempTeams.forEach((team) => {
      let division = divisionTeamsRequestBody.find(
        (d) => d.id === team.divisionId
      );
      division.teams.push(team.id);
    });

    updateDivisionTeams(props.season.id, divisionTeamsRequestBody);
  };

  // Generate schedule for the season with the commissioner-set divisions
  const handleGenerateSchedule = async () => {
    try {
      setLoading(true);
      await generateSchedule(props.season.id);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to generate schedule");
    }

    try {
      setLoading(true);
      const data = await getScheduleBySeasonId(props.season.id);
      setSchedule(data.schedule);
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to get schedule");
    } finally {
      setLoading(false);
    }
  };

  // Handle team deletion
  const handleDeleteTeam = (teamId) => {
    const removeTeam = async (seasonId, teamId) => {
      try {
        setLoading(true);
        await removeTeamFromSeason(seasonId, teamId);
        setLoading(false);
        alert("Team deleted successfully");
      } catch (error) {
        setLoading(false);
        setError(error.message || "Failed to delete team");
      }
    };
    removeTeam(props.season.id, teamId);
  };

  // Launch the season (upcoming -> ongoing)
  const handleLaunchSeason = async () => {
    try {
      setLoading(true);
      await launchSeason(props.season.id);
      setLoading(false);
      alert("Season launched successfully");
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to launch season");
    }
  };

  return (
    <>
      {loading && <LoadingOverlay loading={loading} />}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
        Registered Teams
      </Typography>
      <TeamTable
        registeredTeams={props.registeredTeams}
        tempTeams={tempTeams}
        setTempTeams={setTempTeams}
        divisions={props.divisions}
        getPreferredDivision={getPreferredDivision}
        handleDeleteTeam={handleDeleteTeam}
        tempDivisions={tempDivisions}
        setTempDivisions={setTempDivisions}
      />
      <Box flex flexDirection="row" gap={2}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {tempDivisions.map((division) => (
            <Grid item xs={6} sm={4} md={3} key={division.id}>
              <DivisionCard
                tempTeams={tempTeams}
                division={division}
                calculateDivisionTeams={calculateDivisionTeams}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Button
        variant="contained"
        size="small"
        sx={{ backgroundColor: "#7A003C", mr: 2 }}
        onClick={() => handleSetDivisions()}
      >
        Set Divisions
      </Button>

      <Button
        variant="contained"
        size="small"
        disabled={!divisionsSet}
        sx={{ backgroundColor: "#7A003C" }}
        onClick={() => handleGenerateSchedule()}
      >
        Generate Schedule
      </Button>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
        Schedule
      </Typography>
      {schedule ? (
        <ScheduleTable schedule={schedule} />
      ) : loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Typography>No schedule yet.</Typography>
      )}
      <Button
        variant="contained"
        size="small"
        disabled={!schedule}
        sx={{ backgroundColor: "#7A003C" }}
        onClick={() => handleLaunchSeason()}
      >
        Launch Season
      </Button>
    </>
  );
}
