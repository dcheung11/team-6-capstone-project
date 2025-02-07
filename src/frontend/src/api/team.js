const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

export async function createTeam(name, division, captain, roster) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams/createTeam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, division, captain, roster }),
    });

    console.log("createTeam response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "createTeam failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTeamsById(ids) {
  try {
    const idString = ids.join(",");
    console.log("id stringTEAM ID", idString);
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/teams/${idString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("getTeamsByIds response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Fetching getTeamsByIds failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTeams() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("getTeams response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Fetching teams failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
