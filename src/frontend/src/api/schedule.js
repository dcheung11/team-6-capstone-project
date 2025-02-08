const REACT_APP_API_BASE_URL = "http://localhost:3001/api";

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
    console.log("generate sched response:", response);

    if (!response.ok) {
      throw new Error("Failed to generate schedule");
    }
    return await response.json();
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};

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
