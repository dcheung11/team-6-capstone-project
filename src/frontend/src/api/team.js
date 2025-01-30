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
