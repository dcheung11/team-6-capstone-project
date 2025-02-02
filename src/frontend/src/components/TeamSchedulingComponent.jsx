import React, { useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import TeamTable from "./TeamTable";
import { DivisionCard } from "./DivisionCard";

export default function TeamSchedulingComponent(props) {
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

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
        Registered Teams{" "}
      </Typography>
      <TeamTable
        teams={teams}
        setTeams={setTeams}
        divisions={props.divisions}
        getPreferredDivision={getPreferredDivision}
        handleDeleteTeam={handleDeleteTeam}
      />
      <Box flex flexDirection="row" gap={2}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {props.divisions.map((division) => (
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
  );
}
