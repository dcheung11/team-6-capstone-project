import React, { useState } from "react";
import { Paper, Button, TextField, Snackbar, Alert, Grid } from "@mui/material";
import { createSeason, getAllSeasons } from "../../api/season";

const CreateSeasonForm = (props) => {
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to calculate end date (17 weeks after start date)
  const calculateEndDate = (startDate) => {
    if (!startDate) return ""; // Return empty if no start date is selected
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 17 * 7); // Add 17 weeks
    return end.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    setEndDate(calculateEndDate(selectedStartDate)); // Auto-set end date
  };

  const handleCreateSeason = async () => {
    try {
      await createSeason(seasonName, startDate, endDate);
      setNotification({
        open: true,
        message: "Season created successfully!",
        severity: "success",
      });
      const data = await getAllSeasons();
      props.setSeasons(data.seasons);
    } catch (err) {
      console.log(err);
      setNotification({
        open: true,
        message: err.message || "Failed to create season",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Input Fields Row (Season Name, Start Date, End Date) */}
          <Grid container item spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Season Name"
                type="text"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={endDate}
                disabled // Lock the end date field
              />
            </Grid>
          </Grid>

          {/* Button Row (Separate Row Below) */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#7A003C" }}
              onClick={handleCreateSeason}
            >
              Create New Season
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateSeasonForm;
