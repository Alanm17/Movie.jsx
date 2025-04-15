const axios = require("axios");
require("dotenv").config();
exports.handler = async (event) => {
  const query = event.queryStringParameters?.query;

  const YT_API_KEY = "AIzaSyDU_KWmB1ALUP7wCG8NRHlVdyUTWI6Yf-Q";

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (!query) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing query parameter" }),
    };
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: `${query} official trailer`,
          key: YT_API_KEY,
          maxResults: 1,
          type: "video",
          safeSearch: "strict",
        },
        timeout: 5000,
      }
    );

    const videoId = response.data.items[0]?.id?.videoId || null;
    console.log("video id:", videoId);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ videoId }),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch trailer",
        details: error.message,
      }),
    };
  }
};
