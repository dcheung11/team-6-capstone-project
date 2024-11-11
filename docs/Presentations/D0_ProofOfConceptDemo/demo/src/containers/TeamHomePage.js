import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import teamsJson from "../data/teams.json";
import gameScheduleData from "../data/gameSchedule.json";

const TeamHomePage = (props) => {
  const gameSchedule = gameScheduleData || {}; // Fallback to an empty object
  const teamsData = teamsJson || {};

  const teams = teamsData.map((team) => team.name);

  const [selectedTeam, setSelectedTeam] = useState("");

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const columns = [
    { field: "id", headerName: "Game", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "opponent", headerName: "Opponent", width: 180 },
    { field: "field", headerName: "Field", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
    { field: "results", headerName: "Results", width: 80 },
    { field: "score", headerName: "Score", width: 100 },
  ];

  const transformedRows = Object.values(gameSchedule)
    .flatMap((weekGames) => weekGames) 
    .filter((game) => game.teams.includes(selectedTeam))
    .map((game) => ({
      id: game.slotId,
      date: game.date,
      opponent: game.teams.find((team) => team !== selectedTeam), // Opponent is the other team
      field: game.field,
      time: game.time,
      results: "", // Placeholder, update with actual results if available
      score: "", // Placeholder, update with actual score if available
    }));

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
       {selectedTeam} Schedule
      </Typography>

      <Card variant="outlined" sx={{ marginBottom: 3 }}>
        <CardContent>
          <Box sx={{ backgroundColor: "#7A003C", padding: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Team Information
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="team-select-label">Select Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={selectedTeam}
              label="Select Team"
              onChange={handleTeamChange}
            >
              {teams.map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2">
            TODO: additional data about the team (roster, last game, stats)
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ backgroundColor: "#7A003C", padding: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              2025 Schedule
            </Typography>
          </Box>
          <div style={{ height: 550, width: "100%" }}>
            <DataGrid
              rows={transformedRows}
              columns={columns}
              // pageSizeOptions={[5, 10]}
              sx={{
                border: 0,
                "& .MuiDataGrid-cell": {
                  padding: "8px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: "#7A003C",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TeamHomePage;
