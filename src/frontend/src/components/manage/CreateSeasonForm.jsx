import React, { useState } from "react";
import { Paper, Button, TextField, Snackbar, Alert, Grid } from "@mui/material";
import { createSeason, getAllSeasons } from "../../api/season";

// McMaster colors
const MCMASTER_COLORS = {
  maroon: '#7A003C',
  grey: '#5E6A71',
  gold: '#FDBF57',
  lightGrey: '#F5F5F5',
};

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
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 17 * 7);
    return end.toISOString().split("T")[0];
  };

  // Handle start date change
  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    setEndDate(calculateEndDate(selectedStartDate));
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
      
      // Clear form
      setSeasonName("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      console.log(err);
      setNotification({
        open: true,
        message: err.message || "Failed to create season",
        severity: "error",
      });
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: MCMASTER_COLORS.maroon,
      },
      '&.Mui-focused fieldset': {
        borderColor: MCMASTER_COLORS.maroon,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: MCMASTER_COLORS.maroon,
    },
  };

  return (
    <>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid container item spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Season Name"
                type="text"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={startDate}
                onChange={handleStartDateChange}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={endDate}
                disabled
                sx={{
                  ...textFieldStyles,
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: MCMASTER_COLORS.grey,
                    backgroundColor: MCMASTER_COLORS.lightGrey,
                  }
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateSeason}
              disabled={!seasonName || !startDate}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: MCMASTER_COLORS.maroon,
                '&:hover': {
                  backgroundColor: '#5C002E',
                },
                '&.Mui-disabled': {
                  backgroundColor: MCMASTER_COLORS.grey,
                  color: 'white',
                },
              }}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            ...(notification.severity === 'success' && {
              backgroundColor: MCMASTER_COLORS.maroon,
            })
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateSeasonForm;
