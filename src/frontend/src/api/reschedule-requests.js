// This file contains API calls related to reschedule requests.

const API_URL = "http://localhost:3001/api/reschedule-requests";

// This function swaps two game slots by sending a PUT request to the server.
export const swapSlots = async (slot1Id, slot2Id) => {
  try {
    const response = await fetch(`${API_URL}/swap`, {
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ slot1Id, slot2Id }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Reschedule request creation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error swapping slots:", error);
    throw error;
  }
};

// gets all reschedule requests
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

// gets all available game slots
export const getAvailableGameslots = async () => {
  try {
    const response = await fetch(`${API_URL}/available-gameslots`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
    }});

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching available game slots:", error);
    throw error;
  }
};

// creates new reschedule request
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
      const error = await response.json();
      throw new Error(error.message || "Reschedule request creation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating reschedule request:", error);
    throw error;
  }
};

// accepts reschedule request
export const acceptRescheduleRequest = async (rescheduleRequestId, newSlot) => {
  try {
    const response = await fetch(`${API_URL}/${rescheduleRequestId}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newSlot }),
    });

    if (!response.ok) throw new Error("Failed to accept reschedule");

    return await response.json();
  } catch (error) {
    console.error("Error accepting reschedule:", error);
    throw error;
  }
};

// declines reschedule request
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

// deletes reschedule request
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
