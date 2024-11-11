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
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemButton,
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { DataGrid } from "@mui/x-data-grid";
import gameScheduleData from "../data/gameSchedule.json";
import teamsJson from "../data/teams.json";

const SchedulePage = (props) => {
  const gameSchedule = gameScheduleData || {}; // Fallback to an empty object
  const teamsData = teamsJson || {};

  const [selectedDivision, setSelectedDivision] = useState("All");
  const [expanded, setExpanded] = React.useState(false);

  const handleDivisionChange = (event) => {
    setSelectedDivision(event.target.value);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const columns = [
    { field: "division", headerName: "Division", width: 70 },
    { field: "id", headerName: "Game", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "home", headerName: "Home", width: 180 },
    { field: "away", headerName: "Away", width: 180 },
    { field: "field", headerName: "Field", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
  ];

  const transformedDataRows = Object.values(gameSchedule)
    .flatMap((weekGames) => weekGames)
    .filter(
      (game) => selectedDivision === "All" || game.division === selectedDivision
    )
    .map((game) => ({
      division: game.division,
      id: game.slotId,
      date: game.date,
      home: game.teams[0],
      away: game.teams[1],
      field: game.field,
      time: game.time,
    }));

  const filteredTeams =
    selectedDivision === "All"
      ? teamsData
      : teamsData.filter((team) => team.division === selectedDivision);

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        MacGSA Summer Softball League Schedule
      </Typography>

      <Card variant="outlined" sx={{ marginBottom: 3 }}>
        <CardContent>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel id="division-select-label">Select Division</InputLabel>
            <Select
              labelId="division-select-label"
              id="division-select"
              value={selectedDivision}
              label="Select Division"
              onChange={handleDivisionChange}
            >
              {/* temp hard coded for the purposes of our demo and dummy data */}
              {["All", "A", "B"].map((div) => (
                <MenuItem key={div} value={div}>
                  {div}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ListItemButton onClick={handleExpandClick}>
            <ListItemText primary="Show/Hide Teams" />
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <List>
              {filteredTeams.map((team) => (
                <ListItem key={team.id}>
                  <ListItemText primary={team.name} />
                </ListItem>
              ))}
            </List>
          </Collapse>
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
              rows={transformedDataRows}
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

export default SchedulePage;
