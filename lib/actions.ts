"use server"

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const apiUrl = `http://127.0.0.1:5000?msg=${encodeURIComponent(message)}`;

    // Make GET request to your API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Parse response as text
    const data = await response.text();

    return data;
  } catch (error) {
    console.error("Error with API:", error);
    return "Oops! There was an error processing your request.";
  }
}
