const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; 

// Fetch all announcements
export async function getAnnouncements() {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/announcements`);
    if (!response.ok) {
      throw new Error("Failed to fetch announcements");
    }
    const data = await response.json();
    return data.announcements; // Return only the announcements array
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
}

// Fetch a single announcement by ID
export async function getAnnouncementById(id) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/announcements/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch announcement");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching announcement:", error);
    throw error;
  }
}

// Create a new announcement
export async function createAnnouncement(title, content) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/announcements/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create announcement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
}

// Edit an announcement by ID
export async function editAnnouncement(id, title, content) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/announcements/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to edit announcement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing announcement:", error);
    throw error;
  }
}

// Delete an announcement by ID
export async function deleteAnnouncement(id) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete announcement");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}
