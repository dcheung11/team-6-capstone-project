import { Typography, Container } from "@mui/material";
import NavBar from "../../components/NavBar";
import PlayerTable from "../../components/Tables/PlayerTable";
import { allPlayers } from "../../api/player";
import { useState, useEffect } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";

// Page for searching and inviting players to your team as a captain
export default function Players() {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const data = await allPlayers();
        setPlayers(data.players);
      } catch (err) {
        console.log(err.message || "Error fetching players:");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingOverlay loading={loading} />
        <Typography
		  variant="h5"
		  component="h2"
		  gutterBottom
		  sx={{
			fontSize: { xs: "2.5rem", md: "3rem" },
			fontWeight: 700,
			color: "black",
			fontFamily: "inherit",
		  }}>
          Players
        </Typography>
        <PlayerTable players={players} />
      </Container>
    </div>
  );
}
