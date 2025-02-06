import React, { useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import TeamTable from "./../TeamTable";
import { DivisionCard } from "../DivisionCard";
import { formatDate } from "../../utils/Formatting";

export default function LaunchSeasonForm(props) {
  const [teams, setTeams] = useState(props.teams);

  const getPreferredDivision = (refTeam) => {
    const team = props.teams.filter((team) => team.name === refTeam.name)[0];
    return team && team.division ? team.division : null;
  };

  const calculateDivisionTeams = (division) => {
    return teams.filter((team) => team.division === division);
  };

  const handleGenerateSchedule = () => {
    // Implement schedule generation logic here
    // call api to generate schedule
    console.log("Generating schedule with teams: ", teams);
  };

  const handleDeleteTeam = (name) => {
    console.log(`Deleting team with id ${name}`);

    // Implement team deletion logic here
    // call api to delete team
    setTeams(teams.filter((team) => team.name !== name));
  };
  console.log("props.season", props.season);

  return (
    <>
      <Typography>Start Date: {formatDate(props.season.startDate)}</Typography>
      <Typography>End Date: {formatDate(props.season.endDate)}</Typography>

      {props.season.registeredTeams.length === 0 ? (
        <Typography>Registered Teams: No teams registered</Typography>
      ) : (
        <>
          <TeamTable
            teams={props.season.registeredTeams}
            setTeams={setTeams}
            divisions={props.divisions}
            getPreferredDivision={getPreferredDivision}
            handleDeleteTeam={handleDeleteTeam}
          />

          <Box flex flexDirection="row" gap={2}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {props.season.divisions.map((division) => (
                <Grid item xs={6} sm={4} md={3} key={division.id}>
                  <DivisionCard
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
            sx={{ backgroundColor: "#7A003C" }}
            onClick={() => handleGenerateSchedule()}
          >
            Generate Schedule
          </Button>
        </>
      )}
    </>
  );
}
