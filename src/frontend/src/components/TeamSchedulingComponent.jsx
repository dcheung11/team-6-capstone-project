import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import TeamTable from "./TeamTable";
import { DivisionCard } from "./DivisionCard";
import { getDivisionsById } from "../api/division";
import { getTeamsById } from "../api/team";
import { updateSeasonDivisionTeams } from "../api/season";

export default function TeamSchedulingComponent(props) {
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registeredTeams, setRegisteredTeams] = useState(null);
  const [teams, setTeams] = useState(props.teams);
  const [divisionsSet, setDivisionsSet] = useState(false);

  // Used for commissioner to set divisions before generating schedule
  const [tempTeams, setTempTeams] = useState(registeredTeams);
  const [tempDivisions, setTempDivisions] = useState(divisions);

  function generateTempDivision(divisions, teams) {
    const tempDivisions = divisions.map((division) => {
      const divisionTeams = teams.filter(
        (team) => team.division === division.id
      );
      return { ...division, teams: divisionTeams };
    });

    return tempDivisions;
  }

  // fetching divisions and teams
  useEffect(() => {
    const fetchDivisions = async (divisionIds) => {
      try {
        const data = await getDivisionsById(divisionIds);
        setDivisions(data.divisions);
        setTempDivisions(data.divisions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchTeams = async (teamIds) => {
      try {
        const data = await getTeamsById(teamIds);
        setRegisteredTeams(data.teams);
        setTempTeams([...data.teams]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (props.divisions && props.divisions.length > 0) {
      fetchDivisions(props.divisions);
    } else {
      setLoading(false);
      setError("No division IDs provided");
    }

    if (
      props.season &&
      props.season.registeredTeams &&
      props.season.registeredTeams.length > 0
    ) {
      fetchTeams(props.season.registeredTeams);
    } else {
      setLoading(false);
      setError("No Team IDs provided");
    }
  }, []);

  useEffect(() => {
    setTempDivisions(generateTempDivision(tempDivisions, registeredTeams));
  }, [registeredTeams]);

  const getPreferredDivision = (refTeam) => {
    const team = props.teams.filter((team) => team.name === refTeam.name)[0];
    return team && team.division ? team.division : null;
  };

  const calculateDivisionTeams = (division) => {
    return teams.filter((team) => team.division === division);
  };

  const handleSetDivisions = () => {

    const updateDivisionTeams = async (seasonId, divisionTeams) => {
      try {
        const data = await updateSeasonDivisionTeams(seasonId, divisionTeams);
        setDivisionsSet(true);
      } catch (err) {
        console.error(err);
      }
    };

    // prepare request body
    const divisionTeamsRequestBody = [];
    divisions.forEach((division) => {
      divisionTeamsRequestBody.push({ id: division.id, teams: [] });
    });
    tempTeams.forEach((team) => {
      let division = divisionTeamsRequestBody.find(
        (d) => d.id === team.division
      );
      division.teams.push(team.id);
    });

    updateDivisionTeams(props.season.id, divisionTeamsRequestBody);
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
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
        Registered Teams{" "}
      </Typography>
      <TeamTable
        registeredTeams={registeredTeams}
        tempTeams={tempTeams}
        setTempTeams={setTempTeams}
        divisions={divisions}
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
    </>
  );
}
