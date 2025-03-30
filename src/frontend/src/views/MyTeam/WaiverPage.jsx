import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
} from '@mui/material';

export default function WaiverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecked, setIsChecked] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [seasonId, setSeasonId] = useState(null);

  useEffect(() => {
    // Get teamId from URL parameters
    const params = new URLSearchParams(location.search);
    const teamID = params.get('teamId');
    const seasonId = params.get('seasonId');
    if (teamID) {
      setTeamId(teamID);
    }
    if (seasonId) {
      setSeasonId(seasonId);
    }
  }, [location]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = () => {
    if (isChecked && teamId) {
      navigate(`/team/${teamId}`);
    } else if (isChecked && !teamId) {
      navigate(`/home`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Waiver Form
        </Typography>
        
        {/* Iframe container */}
        <Box 
          sx={{ 
            width: '100%', 
            height: '600px', 
            mb: 3,
            border: '1px solid #ccc',
            borderRadius: 1,
          }}
        >
          <iframe 
            width="100%" 
            height="100%" 
            src="https://forms.office.com/Pages/ResponsePage.aspx?id=B2M3RCm0rUKMJSjNSW9HchGPxkBSqu9MvUTc8JXTFOBUNTUwWktNM09BNEZLQTY4WDhRV1pXTjlINy4u&embed=true" 
            frameBorder="0" 
            marginWidth="0" 
            marginHeight="0" 
            style={{ border: 'none', maxWidth: '100%', maxHeight: '100vh' }}
            allowFullScreen 
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            msallowfullscreen="true"
          >
          </iframe>
        </Box>

        {/* Checkbox and Submit button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isChecked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="I certify that I have completed and submitted the waiver form"
          />
          
          <Button
            variant="contained"
            disabled={!isChecked}
            onClick={handleSubmit}
            sx={{
              bgcolor: "#7A003C",
              '&:hover': {
                bgcolor: "#630031",
              },
              '&.Mui-disabled': {
                bgcolor: '#ccc',
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </div>
  );
}
