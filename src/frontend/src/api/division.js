// Author: Damien Cheung
// Description: API functions for fetching division data from the backend
// Last Modified: 2025-03-25

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Get a division by ID
export async function getDivisionsById(ids) {
  try {
    // Join the array of IDs into a comma-separated string
    const idString = ids.join(",");
    const response = await fetch(`${REACT_APP_API_BASE_URL}/divisions/${idString}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "getDivisionsById failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
