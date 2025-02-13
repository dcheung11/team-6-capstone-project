const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

export async function signup(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    console.log("Signup response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function allPlayers() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("All players response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Fetching all players failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlayerById(playerId) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players/${playerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Get player by ID response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Fetching player by ID failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function acceptInvite(playerId, teamId) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players/acceptinvite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerId, teamId), // Send both playerId and teamId
    });

    console.log("Accept invite response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Accept invite failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function sendInvite(playerId, teamId) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players/sendinvite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerId, teamId), // Send both playerId and teamId
    });

    console.log("Send invite response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Send invite failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
