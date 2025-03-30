// API functions for fetching division data from the backend

const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

// Get a division by ID
export async function getDivisionsById(ids) {
  try {
    // Join the array of IDs into a comma-separated string
    const idString = ids.join(",");
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/divisions/${idString}`
    );
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
