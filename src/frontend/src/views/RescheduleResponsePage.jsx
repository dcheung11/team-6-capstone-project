import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Container, Button, Stack, Box, CircularProgress } from "@mui/material";
import NavBar from "../components/NavBar";
import { getNotificationById, updateNotification } from "../api/notification";
import { acceptRescheduleRequest, declineRescheduleRequest } from "../api/reschedule-requests";

export default function RescheduleRequestPage() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await getNotificationById(notificationId);
        setNotification(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, [notificationId]);

  const handleResponse = async (accepted) => {
    try {
      await updateNotification(notificationId);
      if (accepted) {
        await acceptRescheduleRequest(notification.rescheduleRequestId);
      } else {
        await declineRescheduleRequest(notification.rescheduleRequestId);
      }
      navigate(`/team/${notification.recipient}`); // Redirect back to team page
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reschedule Request
        </Typography>
        
        {notification && (
          <Box>
            <Typography variant="body1" paragraph>
              {notification.message}
            </Typography>
            
            <Typography variant="subtitle1" paragraph>
              Original Date: {/*new Date(notification.rescheduleRequest.game.date).toLocaleString()*/}
            </Typography>
            
            {/* TODO: change these dates to be actual reschedule dates */}
            {/* TODO: gonna have to give reschedule requests property to team or notification model */}
            <Typography variant="subtitle1" paragraph>
              Proposed Date: { /* new Date(notification.rescheduleRequest.requestedGameslot.date).toLocaleString() */ }
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleResponse(true)}
              >
                Accept Reschedule
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleResponse(false)}
              >
                Decline Reschedule
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </div>
  );
}