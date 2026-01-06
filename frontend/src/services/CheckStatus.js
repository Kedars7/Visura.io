import { API_URL } from '../config/api';

async function getRuns(eventId) {
  try {
    const response = await fetch(`${API_URL}/api/inngest-proxy/events/${eventId}/runs`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch runs: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.data || json;
  } catch (error) {
    console.error("Error in getRuns:", error);
    throw error;
  }
}

export { getRuns };
