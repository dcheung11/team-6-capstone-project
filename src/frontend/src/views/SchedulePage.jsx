import React from "react";
import {
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  Box,
  Tab,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import NavBar from "../components/NavBar";
import schedule from "../data/schedule.json";
import seasons from "../data/seasons.json";
import ScheduleTable from "../components/ScheduleTable";

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

export default function SchedulePage() {
  //   const [selectedSeason, setSelectedSeason] = useState("2025");
  //   const [selectedDivision, setSelectedDivision] = useState("Division A");
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container sx={{ py: 4, flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Schedule
          </Typography>
          <Box>
            <FormControl sx={{ minWidth: 180 }}>
              <Select defaultValue="2025">
                {seasons.map((season) => (
                  <MenuItem value={season.name}>{season.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <Select defaultValue="divA">
                <MenuItem value="divA">Division A</MenuItem>
                <MenuItem value="divB">Division B</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Table View" value="1" />
                    <Tab label="View Two" value="2" />
                    <Tab label="View Three" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <ScheduleTable schedule={schedule} />
                </TabPanel>
                <TabPanel value="2">View Two</TabPanel>
                <TabPanel value="3">View Three</TabPanel>
              </TabContext>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
