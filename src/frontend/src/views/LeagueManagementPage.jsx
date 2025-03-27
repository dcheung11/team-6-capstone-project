import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavBar from "../components/NavBar";
import TeamSchedulingComponent from "../components/TeamSchedulingComponent";
import {
  archiveSeason,
  getAllSeasons,
  getArchivedSeasons,
  getOngoingSeasons,
  getUpcomingSeasons,
} from "../api/season";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { formatDate } from "../utils/Formatting";
import CreateSeasonForm from "../components/manage/CreateSeasonForm";
import SeasonsTable from "../components/manage/SeasonsTable";
import ScheduleTable from "../components/ScheduleTable";
import LoadingOverlay from "../components/LoadingOverlay";
import CommissionerContactInfo from "../components/manage/CommissionerContactInfo";

const LeagueManagementPage = () => {
  // Season state values
  const [upcomingSeasons, setUpcomingSeasons] = useState(null);
  const [ongoingSeasons, setOngoingSeasons] = useState(null);
  const [archivedSeasons, setArchivedSeasons] = useState(null);

  const [seasons, setSeasons] = useState(null);

  // API state values
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Component state values
  const [value, setValue] = useState("manage");
  const handleTabChange = (event, newValue) => {
    setLoading(true);

    setTimeout(() => {
      setValue(newValue);
      setLoading(false);
    }, 50);
  };

  useEffect(() => {
    const fetchUpcomingSeasons = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingSeasons();
        setUpcomingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch upcoming seasons");
      }
    };

    const fetchOngoingSeasons = async () => {
      try {
        setLoading(true);
        const data = await getOngoingSeasons();
        setOngoingSeasons(data.seasons);
      } catch (err) {
        setError(err.message || "Failed to fetch ongoing seasons");
      } finally {
        setLoading(false);
      }
    };

    const fetchArchivedSeasons = async () => {
      try {
        setLoading(true);
        const data = await getArchivedSeasons();
        setArchivedSeasons(data.seasons);
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
    fetchArchivedSeasons();
    fetchSeasons();
  }, []);

  const handleArchiveSeason = async (seasonId) => {
    try {
      setLoading(true);
      await archiveSeason(seasonId);
      setLoading(false);
      alert("Season archived successfully");
    } catch (error) {
      setLoading(false);
      setError(error.message || "Failed to archive season");
    }
  };

  const InfoText = ({
    children,
    italic = true,
    bold = true,
    size = "0.875rem",
  }) => {
    return (
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          fontStyle: italic ? "italic" : "normal",
          fontWeight: bold ? "bold" : "normal",
          fontSize: size,
          mb: 2,
        }}
      >
        {children}
      </Typography>
    );
  };

  return (
    <>
      <NavBar />
      {loading && <LoadingOverlay loading={loading} />}

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
                <Tab label="Archived Seasons" value="archived" />
                <Tab label="Contact Info" value="contacts" />
              </TabList>
            </Box>
            <TabPanel value="manage">
              <InfoText>
                Create new seasons and delete seasons that are no longer needed.
              </InfoText>
              <Typography variant="h7" gutterBottom sx={{ mb: 2 }}>
                Create New Season
              </Typography>
              <CreateSeasonForm seasons={seasons} setSeasons={setSeasons} />
              {seasons && seasons.length > 0 ? (
                <SeasonsTable seasons={seasons} setSeasons={setSeasons} />
              ) : (
                <Typography>No seasons available</Typography>
              )}
            </TabPanel>
            <TabPanel value="upcoming">
              <InfoText>
                Manage and launch seasons that are currently open for
                registration. Seasons will automatically launch on the start date.
              </InfoText>
              {upcomingSeasons && upcomingSeasons.length > 0 ? (
                upcomingSeasons.map((season) => (
                  <Accordion key={season.id}>
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
                        season={season}
                        divisions={season.divisions}
                        registeredTeams={season.registeredTeams}
                      />
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No upcoming seasons</Typography>
              )}
            </TabPanel>
            <TabPanel value="ongoing">
              <InfoText>
                Input scores and view the schedules and results of ongoing
                seasons. Seasons will be automatically archived after the end date.
              </InfoText>

              {ongoingSeasons && ongoingSeasons.length > 0 ? (
                ongoingSeasons.map((season) => (
                  <Accordion key={season.id}>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      id="ongoing-header"
                    >
                      <Typography variant="h5" component="span">
                        {season.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ScheduleTable schedule={season.schedule} />
                      <Button
                      
                        variant="contained"
                        color="error"
                        onClick={() => handleArchiveSeason(season.id)}                      >
                        Archive Season
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography>No ongoing seasons</Typography>
              )}
            </TabPanel>
            <TabPanel value="archived">
              <InfoText>
                View schedules and results of past archived seasons.
              </InfoText>
              {!!archivedSeasons ?
                (archivedSeasons.map((season) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        id="archived-header"
                      >
                        <Typography variant="h5" component="span">
                          {season.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ScheduleTable schedule={season.schedule} archived />
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>No ongoing seasons</Typography>
              )}
            </TabPanel>
            <TabPanel value="contacts">
              <InfoText>
                View contact information for team captains across all seasons.
              </InfoText>
              <CommissionerContactInfo seasons={seasons} />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </>
  );
};

export default LeagueManagementPage;
