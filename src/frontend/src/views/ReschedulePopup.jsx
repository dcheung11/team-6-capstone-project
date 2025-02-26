import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';
import { createRescheduleRequest } from '../api/reschedule-requests';
import { useAuth } from '../hooks/AuthProvider'; // Add auth if needed

const ReschedulePopup = ({ game, open, onClose, onRescheduleSuccess }) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth(); // Get auth context if needed for tokens

  const handleSubmit = async () => {
    if (!newDate || !newTime) {
      setError('Please select both date and time');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create ISO datetime string
      const newDateTime = new Date(`${newDate}T${newTime}`);
      
      const requestData = {
        gameId: game._id,
        requestedDateTime: newDateTime.toISOString(),
        originalDateTime: game.date,
        requestingTeamId: game.homeTeam._id, // Verify if this is correct
        status: 'pending'
      };

      // Add authorization header if needed
      const response = await createRescheduleRequest(requestData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      onRescheduleSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit reschedule request');
      console.error('Reschedule error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#7A003C', color: 'white' }}>
        Request Reschedule
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, minHeight: '200px' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Original Game: {new Date(game.date).toLocaleString()}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {game.homeTeam.name} vs {game.awayTeam.name}
        </Typography>

        <TextField
          label="New Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ min: new Date().toISOString().split('T')[0] }} // Prevent past dates
        />

        <TextField
          label="New Time"
          type="time"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          inputProps={{ step: 300 }} // 5 minute increments
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          sx={{ color: '#7A003C' }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#7A003C', '&:hover': { bgcolor: '#600030' } }}
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : 'Submit Request'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReschedulePopup;