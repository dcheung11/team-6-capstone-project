const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

export async function createSeason(
  name,
  startDate,
  endDate,
  allowedDivisions = 4
) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/create`, {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, startDate, endDate, allowedDivisions }),
    });

    console.log("Create Season response:", response);
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

export async function getOngoingSeasons() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/ongoing`, {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/ongoing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Get Ongoing Seasons response:", data);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Get ongoing seasons failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUpcomingSeasons() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/upcoming`, {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/upcoming`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Get Upcoming Seasons response:", data);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Get upcoming seasons failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getArchivedSeasons() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/archived`, {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/archived`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Get Archived Seasons response:", data);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Get archived seasons failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllSeasons() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Get All Seasons response:", data);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Get all seasons failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteSeason(id) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Delete Season response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Delete season failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSeasonById(id) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/seasons/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Get Season by ID response:", data);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Get season by ID failed");
    }
    return data;
  } catch (error) {
    throw error;
  }
}
