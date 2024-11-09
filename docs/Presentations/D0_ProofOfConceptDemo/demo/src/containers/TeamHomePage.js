import * as React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const TeamHomePage = (props) => {
  const columns = [
    { field: "id", headerName: "Game", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "opponent", headerName: "Opponent", width: 180 },
    { field: "field", headerName: "Field", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
    { field: "results", headerName: "Results", width: 80 },
    { field: "score", headerName: "Score", width: 100 },
  ];

  const rows = [
    {
      id: 1,
      date: "Apr 15",
      opponent: "Eagles United",
      field: 1,
      time: "5:00 PM",
      results: "W",
      score: "15-0",
    },
    {
      id: 2,
      date: "Jul 18",
      opponent: "Hawks Force",
      field: 2,
      time: "6:30 PM",
      results: "",
      score: "",
    },
    {
      id: 3,
      date: "Aug 22",
      opponent: "Lions Pride",
      field: 3,
      time: "8:00 PM",
      results: "",
      score: "",
    },
    {
      id: 4,
      date: "May 25",
      opponent: "Tigers Club",
      field: 1,
      time: "9:30 PM",
      results: "",
      score: "",
    },
    {
      id: 5,
      date: "Jun 28",
      opponent: "Wolves Pack",
      field: 2,
      time: "5:00 PM",
      results: "",
      score: "",
    },
    {
      id: 6,
      date: "Jul 01",
      opponent: "Bears Squad",
      field: 3,
      time: "6:30 PM",
      results: "",
      score: "",
    },
    {
      id: 7,
      date: "Aug 05",
      opponent: "Falcons Wings",
      field: 1,
      time: "8:00 PM",
      results: "",
      score: "",
    },
    {
      id: 8,
      date: "Aug 10",
      opponent: "Sharks Team",
      field: 2,
      time: "9:30 PM",
      results: "",
      score: "",
    },
    {
      id: 9,
      date: "Aug 12",
      opponent: "Panthers Crew",
      field: 3,
      time: "5:00 PM",
      results: "",
      score: "",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Team Schedule
      </Typography>

      <Card variant="outlined" sx={{ marginBottom: 3 }}>
        <CardContent>
          <Box sx={{ backgroundColor: "#7A003C", padding: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
              Team Information
            </Typography>
          </Box>
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
              rows={rows}
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
