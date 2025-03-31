// Author: Derek Li
// Description: API functions for updating game scores
// Last Modified: 2025-03-25


import { REACT_APP_API_BASE_URL } from "../utils/Constants";

// Updating scores for a game
export async function updateScore(gameId, homeScore, awayScore, defaultLossTeam) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/games/update-score/${gameId}/${homeScore}/${awayScore}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ defaultLossTeam }), // Send in request body
    });

    if (!response.ok) {
      throw new Error("Failed to update score");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
}
