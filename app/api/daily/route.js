import axios from "axios";

export async function POST() {

   console.log("✅ DAILY ROUTE HIT");
  try {
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      {
        properties: {
          enable_chat: false,
          start_audio_off: false,
          start_video_off: true,
          exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        },
      }, 
      {
        headers: {
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json({
      roomUrl: response.data.url,
    });
  } catch (error) {
    console.error("Daily room creation error:", error.response?.data || error);
    return new Response("Failed to create Daily room", { status: 500 });
  }
}
