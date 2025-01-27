import React from "react";
import { useState } from "react";
import {
  Typography,
  Container,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import NavBar from "../components/NavBar";
import teams from "../data/teams";
import TeamTable from "../components/TeamTable";
import schedule from "../data/schedule";
import ScheduleTable from "../components/ScheduleTable";

const divisions = [
  { id: "A", name: "A" },
  { id: "B", name: "B" },
  { id: "C", name: "C" },
  { id: "D", name: "D" },
];

const columns = [
  { header: "Game ID", key: "game_id" },
  { header: "Date", key: "date" },
  { header: "Field", key: "field" },
  { header: "Time", key: "time" },
  { header: "Team 1", key: "team1" },
  { header: "Team 2", key: "team2" },
  { header: "Division", key: "division" },
  { header: "Result", key: "result" },
  { header: "Score", key: "score" },
];

const LeagueManagementPage = () => {
  const [openLaunchDialog, setOpenLaunchDialog] = useState(false);
  const [seasonName, setSeasonName] = useState("");

  const handleGenerateSchedule = () => {
    // Implement schedule generation logic here
    // call api to generate schedule
  };

  const handleLaunchSeason = () => {
    // Implement season launch logic here
    console.log(`Launching season: ${seasonName}`);
    setOpenLaunchDialog(false);
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          League Management
        </Typography>
        <Paper sx={{ p: 2, mb: 4 }}>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mr: 2 }}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 2 }}>
            Registered Teams{" "}
          </Typography>
          <TeamTable teams={teams} divisions={divisions} />

          <Button
            variant="contained"
            sx={{ ml: 2, backgroundColor: "#7A003C" }}
            onClick={() => handleGenerateSchedule()}
          >
            Generate Schedule
          </Button>
        </Paper>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Schedule
        </Typography>
        <Paper sx={{ p: 2 }}>
          <ScheduleTable columns={columns} data={schedule} />
          <Button
            variant="contained"
            sx={{ ml: 2, backgroundColor: "#7A003C" }}
            onClick={() => setOpenLaunchDialog(true)}
          >
            Launch New Season
          </Button>
        </Paper>
      </Container>

      <Dialog
        open={openLaunchDialog}
        onClose={() => setOpenLaunchDialog(false)}
      >
        <DialogTitle>Launch New Season</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="seasonName"
            label="Season Name"
            type="text"
            fullWidth
            variant="standard"
            value={seasonName}
            onChange={(e) => setSeasonName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLaunchDialog(false)}>Cancel</Button>
          <Button onClick={handleLaunchSeason}>Launch</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeagueManagementPage;
