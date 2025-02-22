const REACT_APP_API_BASE_URL = "http://localhost:3001/api";

export const getStandingsByDivision = async (divisionId) => {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/standings/${divisionId}`);

    console.log("API Response:", response); // debugging

    if (!response.ok) {
      throw new Error(`Failed to fetch standings. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Standings:", data);
    return data.standings.rankings || [];
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
};
