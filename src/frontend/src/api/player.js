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

    console.log("Signup response:", response); // Log the response
    if (!response.ok) {
      const error = await response.json();
      console.error("Error response:", error); // Log error details
      throw new Error(error.message || "Signup failed");
    }

    // Log the response to verify the returned data
    const data = await response.json();
    console.log("Signup successful:", data); 

    return data; 
  } catch (error) {
    console.error("Error during signup:", error.message);
    throw error; 
  }
}
