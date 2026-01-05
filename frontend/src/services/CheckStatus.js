const API_KEY = import.meta.env.VITE_INNGEST_SIGNING_KEY ;
const SERVER_URL = import.meta.env.VITE_INNGEST_SERVER_URL;

async function getRuns(eventId) {
  try {
    const response = await fetch(`${SERVER_URL}/v1/events/${eventId}/runs`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch runs: ${response.status} ${response.statusText}`);
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Inngest dev server not running or returned non-JSON response. Please ensure the Inngest dev server is running on port 8288.");
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error in getRuns:", error);
    throw error;
  }
}

export { getRuns };
