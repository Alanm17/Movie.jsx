const axios = require('axios');

exports.handler = async (event) => {
  const { query } = event.queryStringParameters;
  const YT_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const res = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}+official+trailer&key=${YT_KEY}`
    );
    return {
      statusCode: 200,
      body: JSON.stringify(res.data.items[0]?.id.videoId || null),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch trailer" }),
    };
  }
};