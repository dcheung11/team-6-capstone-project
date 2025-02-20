const API_URL = "http://localhost:3001/api/reschedule-requests";

export const getRescheduleRequests = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reschedule requests:", error);
    throw error;
  }
};

export const createRescheduleRequest = async (requestData) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating reschedule request:", error);
    throw error;
  }
};

export const acceptRescheduleRequest = async (rescheduleRequestId) => {
  try {
    const response = await fetch(`${API_URL}/${rescheduleRequestId}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to accept reschedule");
    return await response.json();
  } catch (error) {
    console.error("Error accepting reschedule:", error);
    throw error;
  }
};

export const declineRescheduleRequest = async (rescheduleRequestId) => {
  try {
    const response = await fetch(`${API_URL}/${rescheduleRequestId}/decline`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to decline reschedule");
    return await response.json();
  } catch (error) {
    console.error("Error declining reschedule:", error);
    throw error;
  }
};

export const deleteRescheduleRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/${requestId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting reschedule request:", error);
    throw error;
  }
};
