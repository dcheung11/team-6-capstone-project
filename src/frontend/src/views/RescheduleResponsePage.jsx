import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Container, Button, Stack, Box, CircularProgress, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, } from "@mui/material";
import NavBar from "../components/NavBar";
import { getNotificationById, updateNotification } from "../api/notification";
import { acceptRescheduleRequest, declineRescheduleRequest } from "../api/reschedule-requests";
import { formatDate, getDayOfWeek } from "../utils/Formatting";

export default function RescheduleRequestPage() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [confirmDeclinePopup, setConfirmDeclinePopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  // const handleResponse = async (accepted) => {
  //   try {
  //     // await updateNotification(notificationId);
  //     if (accepted) {
  //       await acceptRescheduleRequest(notification.rescheduleRequestId);
  //     } else {
  //       await declineRescheduleRequest(notification.rescheduleRequestId);
  //     }
  //     navigate(`/team/${notification.recipient}`); // Redirect back to team page
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const handleSelectedSlot = async (slot) => {
    setSelectedSlot(slot);
    setConfirmPopup(true);
  }

  const handleDecline = async () => {
    setConfirmDeclinePopup(true);
  }

  const confirmDecline = async () => {
    try {
      await declineRescheduleRequest(notification.rescheduleRequestId._id);
      navigate(`/team/${notification.recipient._id}`); // Redirect back to team page
    } catch (err) {
      setError(err.message);
    }
  }

  const confirmSelection = async () => {
    try {
      await acceptRescheduleRequest(notification.rescheduleRequestId._id, selectedSlot);
      navigate(`/team/${notification.recipient._id}`); // Redirect back to team page
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {notification.message}
        </Typography>
        
        {notification && (
          <Box>            
            <Typography variant="subtitle1" paragraph>
              Original Game Date: {(new Date(notification.rescheduleRequestId?.gameId?.date)).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month: "long" })} at {notification.rescheduleRequestId?.gameId?.time}, {notification.rescheduleRequestId?.gameId?.field}
            </Typography>

            <Typography variant="subtitle1" paragraph></Typography>
            <Typography variant="subtitle1" paragraph>
              Proposed Dates (select one): 
                <Stack spacing={1} sx={{ mt: 4, alignItems: "center" }}>
                  { notification.rescheduleRequestId?.requestedGameslotIds?.map((slot) => (
                 <Button 
                    key={slot._id} 
                    variant="outlined" 
                    sx={{ 
                      color: "#7A003C", 
                      borderColor: "#7A003C",
                      '&:hover': {
                        backgroundColor: "#f2e1e8",
                        borderColor: "#7A003C"
                      }
                    }}
                    onClick={() => {
                      handleSelectedSlot(slot);
                    }}
                  >
                    {formatDate(slot.date)} at {slot.time}, {slot.field}
                  </Button>
                  ))}
                </Stack>
                <Button variant="outlined" sx={{ color: "#7A003C", borderColor: "#7A003C", '&:hover': {
                        backgroundColor: "#f2e1e8",
                        borderColor: "#7A003C"
                      }, mt: 2 }}
                  onClick={() => {
                    handleDecline();
                  }}
                >
                  None of These Work
                </Button>
            </Typography>
          </Box>
        )}
      </Container>
      
      {/* confirm date popup */}
      <Dialog open={confirmPopup} onClose={() => setConfirmPopup(false)}>
        <DialogTitle>Confirm Date</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure this is the date you want to select?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPopup(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmSelection} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* confirm decline popup */}
      <Dialog open={confirmDeclinePopup} onClose={() => setConfirmDeclinePopup(false)}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to decline all these dates?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeclinePopup(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDecline} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}