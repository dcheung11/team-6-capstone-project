// Contains functions to interact with the notification API
import { REACT_APP_API_BASE_URL } from "../utils/Constants";

const API_URL = `${REACT_APP_API_BASE_URL}/notifications`;

// Get all notifications for a given team
export const getNotificationsByTeamId = async (teamId) => {
  try {
    const response = await fetch(`${API_URL}/team/${teamId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching notifications for team with ID ${teamId}:`,
      error
    );
    throw error;
  }
};

// Get all notifications
export const getNotifications = async () => {
  try {
    const response = await fetch(`${API_URL}/all`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get a single notification by ID
export const getNotificationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching notification with ID ${id}:`, error);
    throw error;
  }
};

// Create a new notification
export const createNotification = async (notificationData) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Update an existing notification
export const updateNotificationStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_URL}/${id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating notification with ID ${id}:`, error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/delete`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting notification with ID ${id}:`, error);
    throw error;
  }
};
