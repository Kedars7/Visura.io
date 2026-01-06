const getRuns = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // For production, you would call Inngest API
    // For now, return a status endpoint or use Inngest SDK
    const inngestApiUrl = `https://api.inngest.com/v1/events/${eventId}/runs`;
    
    const response = await fetch(inngestApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        message: `Failed to fetch runs: ${response.statusText}` 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error in getRuns:", error);
    return res.status(500).json({ 
      message: "Server error", 
      details: error.message 
    });
  }
};

module.exports = { getRuns };
