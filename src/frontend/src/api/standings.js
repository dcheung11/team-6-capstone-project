// Author: Emma Wigglesworth
// Description: Functions to interact with the standings API 
// Last Modified: 2025-03-21

import { REACT_APP_API_BASE_URL } from "../utils/Constants";

// Fetch standings by division ID
export const getStandingsByDivision = async (divisionId) => {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/standings/${divisionId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch standings. Status: ${response.status}`);
    }

    const data = await response.json();

    return data.standings.rankings || [];
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
};
