const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // Backend port

export async function updateScore(gameId, homeScore, awayScore) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/games/update-score/${gameId}/${homeScore}/${awayScore}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
