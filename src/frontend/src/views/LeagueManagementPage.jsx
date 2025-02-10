import React, { useEffect } from "react";
import { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavBar from "../components/NavBar";
import teamsData from "../data/teams";
import TeamSchedulingComponent from "../components/TeamSchedulingComponent";
import {
  getAllSeasons,
  getOngoingSeasons,
  getUpcomingSeasons,
} from "../api/season";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { formatDate } from "../utils/Formatting";
import CreateSeasonForm from "../components/manage/CreateSeasonForm";
import SeasonsTable from "../components/manage/SeasonsTable";

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
  // Season state values
  const [upcomingSeasons, setUpcomingSeasons] = useState(null);
  const [ongoingSeasons, setOngoingSeasons] = useState(null);
  const [seasons, setSeasons] = useState(null);

  // API state values
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Component state values
  const [value, setValue] = useState("manage");
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchUpcomingSeasons = async () => {
      try {
        const data = await getUpcomingSeasons();
        setUpcomingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch upcoming seasons");
      } finally {
        setLoading(false);
      }
    };

    const fetchOngoingSeasons = async () => {
      try {
        const data = await getOngoingSeasons();
        setOngoingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch ongoing seasons");
      } finally {
        setLoading(false);
      }
    };

    const fetchSeasons = async () => {
      try {
        const data = await getAllSeasons();
        setSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch all seasons");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingSeasons();
    fetchOngoingSeasons();
    fetchSeasons();
  }, []);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          League Management
        </Typography>
        <Box>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleTabChange}>
                <Tab label="Manage Seasons" value="manage" />
                <Tab label="Upcoming Seasons" value="upcoming" />
                <Tab label="Ongoing Seasons" value="ongoing" />
              </TabList>
            </Box>
            <TabPanel value="manage">
              <Typography variant="h7" gutterBottom sx={{ mb: 2 }}>
                Create New Season
              </Typography>
              <CreateSeasonForm seasons={seasons} setSeasons={setSeasons} />
              <SeasonsTable seasons={seasons} setSeasons={setSeasons} />
            </TabPanel>
            <TabPanel value="upcoming">
              {!!upcomingSeasons &&
                upcomingSeasons.map((season) => (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      id="upcoming-header"
                    >
                      <Typography variant="h5" component="span">
                        {season.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Start Date: {formatDate(season.startDate)}
                      </Typography>

                      <Typography>
                        End Date: {formatDate(season.endDate)}
                      </Typography>

                      <TeamSchedulingComponent
                        // registeredTeamsIds={season.registeredTeams}
                        season={season}
                        divisions={season.divisions}
                        registeredTeams={season.registeredTeams}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))}
            </TabPanel>
            <TabPanel value="ongoing">Nothing here yet - TODO</TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
};

export default LeagueManagementPage;
