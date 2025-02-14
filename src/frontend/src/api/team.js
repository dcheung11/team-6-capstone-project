const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

// body = { name, divisionId, captainId, roster, seasonId }
export async function registerTeam(body) {
  console.log(JSON.stringify(body));
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/teams/registerTeam`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("registerTeam response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "registerTeam failed");
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

export async function getScheduleGamesByTeamId(id) {
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/teams/schedule/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Fetching schedule failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
