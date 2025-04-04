// Author: Damien Cheung
// Description: The LeagueManagementPage is responsible for managing the league seasons.
// It allows the commissioner to create new seasons, view upcoming and ongoing seasons, and archive past seasons.
// Last Modified: 2025-03-30

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
import CreateSeasonForm from "../components/Forms/CreateSeasonForm";
import SeasonsTable from "../components/Tables/SeasonsTable";
import ScheduleTable from "../components/Tables/ScheduleTable";
import LoadingOverlay from "../components/LoadingOverlay";
import CommissionerContactInfo from "../components/Tables/CommissionerContactInfo";
import { MCMASTER_COLOURS } from "../utils/Constants.js";

// LeagueManagementPage: Displays a page for managing league seasons, including
// creating new seasons, viewing upcoming and ongoing seasons, and archiving past seasons.
// It also includes a contact information section for team captains.
// The page is divided into tabs for easy navigation between different sections.
// The page is intended for use by league commissioners and administrators to manage the league effectively.
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
  const [isTabLoading, setIsTabLoading] = useState(false);

  const handleTabChange = async (event, newValue) => {
    setIsTabLoading(true);
    setValue(newValue);

    // Give time for loading state to show and data to be prepared
    await new Promise((resolve) => setTimeout(resolve, 100));
    setIsTabLoading(false);
  };

  // Fetch seasons data
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

  // Handle archiving a season
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
    bold = false,
    size = "0.875rem",
  }) => {
    return (
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          fontStyle: italic ? "italic" : "normal",
          fontWeight: bold ? 600 : 400,
          fontSize: size,
          color: MCMASTER_COLOURS.grey,
          mb: 3,
          maxWidth: "800px",
        }}
      >
        {children}
      </Typography>
    );
  };

  return (
    <Box sx={{ bgcolor: MCMASTER_COLOURS.lightGrey, minHeight: "100vh" }}>
      <NavBar />
      {loading && <LoadingOverlay loading={loading} />}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            color: "black",
            fontWeight: 900,
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              bgcolor: MCMASTER_COLOURS.gold,
              mt: 2,
              borderRadius: "2px",
            },
          }}
        >
          League Management
        </Typography>

        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "white",
                position: "relative",
                zIndex: 1,
              }}
            >
              <TabList
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTab-root": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: MCMASTER_COLOURS.grey,
                    minWidth: { xs: "120px", sm: "160px" },
                    "&.Mui-selected": {
                      color: MCMASTER_COLOURS.maroon,
                      fontWeight: 600,
                    },
                    "&.Mui-disabled": {
                      color: `${MCMASTER_COLOURS.grey}80`,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: MCMASTER_COLOURS.maroon,
                  },
                  "& .MuiTabs-scrollButtons": {
                    color: MCMASTER_COLOURS.maroon,
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  },
                }}
              >
                <Tab
                  label="Manage Seasons"
                  value="manage"
                  disabled={isTabLoading}
                />
                <Tab
                  label="Upcoming Seasons"
                  value="upcoming"
                  disabled={isTabLoading}
                />
                <Tab
                  label="Ongoing Seasons"
                  value="ongoing"
                  disabled={isTabLoading}
                />
                <Tab
                  label="Archived Seasons"
                  value="archived"
                  disabled={isTabLoading}
                />
                <Tab
                  label="Contact Info"
                  value="contacts"
                  disabled={isTabLoading}
                />
              </TabList>
            </Box>

            {/* Loading overlay component - AI generated */}
            <Box sx={{ position: "relative" }}>
              {isTabLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                  }}
                >
                  <Typography
                    sx={{
                      color: MCMASTER_COLOURS.maroon,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Loading...
                  </Typography>
                </Box>
              )}

              <TabPanel value="manage" sx={{ p: { xs: 2, md: 3 } }}>
                <InfoText>
                  Create new seasons and delete seasons that are no longer
                  needed.
                </InfoText>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: MCMASTER_COLOURS.maroon,
                    fontWeight: 600,
                  }}
                >
                  Create New Season
                </Typography>
                <CreateSeasonForm seasons={seasons} setSeasons={setSeasons} />
                {seasons && seasons.length > 0 ? (
                  <SeasonsTable seasons={seasons} setSeasons={setSeasons} />
                ) : (
                  <Typography>No seasons available</Typography>
                )}
              </TabPanel>
              <TabPanel value="upcoming" sx={{ p: { xs: 2, md: 3 } }}>
                <InfoText>
                  Manage and launch seasons that are currently open for
                  registration. Seasons will automatically launch on the start
                  date.
                </InfoText>
                {upcomingSeasons && upcomingSeasons.length > 0 ? (
                  upcomingSeasons.map((season) => (
                    <Accordion
                      key={season.id}
                      sx={{
                        mb: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          margin: "0 0 16px 0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        sx={{
                          backgroundColor: "rgba(122, 0, 60, 0.03)",
                          "&:hover": {
                            backgroundColor: "rgba(122, 0, 60, 0.05)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: MCMASTER_COLOURS.maroon,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          {season.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            sx={{ mb: 1, color: MCMASTER_COLOURS.grey }}
                          >
                            <strong>Start Date:</strong>{" "}
                            {formatDate(season.startDate)}
                          </Typography>
                          <Typography sx={{ color: MCMASTER_COLOURS.grey }}>
                            <strong>End Date:</strong>{" "}
                            {formatDate(season.endDate)}
                          </Typography>
                        </Box>
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

              <TabPanel value="ongoing" sx={{ p: { xs: 2, md: 3 } }}>
                <InfoText>
                  Input scores and view the schedules and results of ongoing
                  seasons. Seasons will be automatically archived after the end
                  date.
                </InfoText>
                {ongoingSeasons && ongoingSeasons.length > 0 ? (
                  ongoingSeasons.map((season) => (
                    <Accordion
                      key={season.id}
                      sx={{
                        mb: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          margin: "0 0 16px 0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        sx={{
                          backgroundColor: "rgba(122, 0, 60, 0.03)",
                          "&:hover": {
                            backgroundColor: "rgba(122, 0, 60, 0.05)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: MCMASTER_COLOURS.maroon,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          {season.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <ScheduleTable schedule={season.schedule} />
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleArchiveSeason(season.id)}
                          sx={{ mt: 3 }}
                        >
                          Archive Season
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>No ongoing seasons</Typography>
                )}
              </TabPanel>

              <TabPanel value="archived" sx={{ p: { xs: 2, md: 3 } }}>
                <InfoText>
                  View schedules and results of past archived seasons.
                </InfoText>
                {!!archivedSeasons ? (
                  archivedSeasons.map((season) => (
                    <Accordion
                      key={season.id}
                      sx={{
                        mb: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                          margin: "0 0 16px 0",
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        sx={{
                          backgroundColor: "rgba(122, 0, 60, 0.03)",
                          "&:hover": {
                            backgroundColor: "rgba(122, 0, 60, 0.05)",
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: MCMASTER_COLOURS.maroon,
                            fontWeight: 600,
                            fontSize: "1.1rem",
                          }}
                        >
                          {season.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 3 }}>
                        <ScheduleTable schedule={season.schedule} archived />
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography>No ongoing seasons</Typography>
                )}
              </TabPanel>

              <TabPanel value="contacts" sx={{ p: { xs: 2, md: 3 } }}>
                <InfoText>
                  View contact information for team captains across all seasons.
                </InfoText>
                <CommissionerContactInfo seasons={seasons} />
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Container>
    </Box>
  );
};

export default LeagueManagementPage;
