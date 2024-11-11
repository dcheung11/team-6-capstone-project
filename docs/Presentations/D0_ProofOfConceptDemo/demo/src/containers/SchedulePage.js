import * as React from "react";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import gameScheduleData from "../data/gameSchedule.json";

const SchedulePage = (props) => {
  const gameSchedule = gameScheduleData || {}; // Fallback to an empty object

  const columns = [
    { field: "id", headerName: "Game", width: 70 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "home", headerName: "Home", width: 180 },
    { field: "away", headerName: "Away", width: 180 },
    { field: "field", headerName: "Field", width: 100 },
    { field: "time", headerName: "Time", width: 100 },
  ];

  const transformedDataRows = Object.values(gameSchedule).flatMap((weekGames) =>
    weekGames.map((game) => ({
      id: game.slotId,
      date: game.date,
      home: game.teams[0],
      away: game.teams[1],
      field: game.field,
      time: game.time,
    }))
  );

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        MacGSA Summer Softball League Schedule
      </Typography>
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
