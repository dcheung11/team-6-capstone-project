import { Typography, Container } from "@mui/material";
import NavBar from "../components/NavBar";
import PlayerTable from "../components/PlayerTable";
import { allPlayers } from "../api/player";
import { useState, useEffect } from "react";

export default function Players() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        allPlayers()
            .then((data) => {
                setPlayers(data.players);
            })
            .catch((error) => console.error("Error fetching players:", error.message));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
            Players
            </Typography>
            <PlayerTable players={players}/>
            </Container>
        </div>
    )
}
