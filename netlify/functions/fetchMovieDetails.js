const CACHE = {};

exports.handler = async (event) => {
  const { movieId } = event.queryStringParameters;
  const OMDb_API_KEY = process.env.OMDb_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // 1. Check cache first
  if (CACHE[movieId]) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(CACHE[movieId]),
    };
  }

  // 2. Fetch from OMDB if not cached
  try {
    const url = `https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&i=${movieId}`;
    const res = await fetch(url);
    const data = await res.json();

    // 3. Cache successful responses
    if (data.Response === "True") {
      CACHE[movieId] = data;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: data.Error || "Not found" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
