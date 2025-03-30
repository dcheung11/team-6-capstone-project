// Function to interact with the schedule API 
const REACT_APP_API_BASE_URL = "http://localhost:3001/api";

// generate schedule for a season
export const generateSchedule = async (seasonId) => {
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/schedules/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seasonId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate schedule");
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};

// get schedule by season id
export const getScheduleBySeasonId = async (seasonId) => {
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/schedules/season/${seasonId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get schedule");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting schedule:", error);
    throw error;
  }
};

