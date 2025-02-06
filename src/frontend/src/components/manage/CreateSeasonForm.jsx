import React, { useState } from "react";
import { Paper, Button, TextField, Snackbar, Alert } from "@mui/material";
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
        message: "Failed to create season.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 4 }}>
        <TextField
          label="Season Name"
          type="text"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mr: 2 }}
          onChange={(e) => setSeasonName(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mr: 2 }}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button
          variant="contained"
          type="submit"
          sx={{ ml: 2, mt: 1, backgroundColor: "#7A003C" }}
          onClick={handleCreateSeason}
        >
          Create New Season
        </Button>
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
