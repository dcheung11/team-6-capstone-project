// This file contains functions to interact with the backend API for team-related operations.
import { REACT_APP_API_BASE_URL } from "../utils/Constants";

// Function to register a team to a season
export async function registerTeam(body) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams/registerTeam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

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

// Function to fetch all teams by their IDs
export async function getTeamsById(ids) {
  try {
    const idString = ids.join(",");
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams/${idString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

// Function to fetch all teams
export async function getTeams() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

// Function to fetch a team's schedule by its ID
export async function getScheduleGamesByTeamId(id) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams/schedule/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

// Function to remove a player from a team's roster
export async function removePlayerFromRoster(teamId, playerId) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/teams/${teamId}/roster/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Removing player failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
