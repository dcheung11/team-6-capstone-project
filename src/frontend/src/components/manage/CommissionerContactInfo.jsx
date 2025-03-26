import React, { useState } from "react";
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import ContactInfoTable from "../ContactInfoTable";

export default function CommissionerContactInfo({ seasons }) {
  const [selectedSeason, setSelectedSeason] = useState("");

  // Set initial season if available
  React.useEffect(() => {
    if (seasons && seasons.length > 0 && !selectedSeason) {
      setSelectedSeason(seasons[0]._id);
    }
  }, [seasons]);

  if (!seasons || seasons.length === 0) {
    return <Typography>No seasons available</Typography>;
  }

  return (
    <Box>
      <ContactInfoTable currentSeasonId={selectedSeason} allSeasons={seasons} />
    </Box>
  );
} 