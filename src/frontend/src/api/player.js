const REACT_APP_API_BASE_URL = "http://localhost:3001/api"; // replace with your backend port

export async function signup(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/players/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    console.log("Signup response:", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    throw error; 
  }
}
