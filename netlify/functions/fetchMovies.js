const fetch = require("node-fetch");

exports.handler = async (event) => {
  const OMDb_API_KEY = process.env.OMDb_API_KEY; // Set in Netlify Dashboard
  const params = event.queryStringParameters;

  if (!OMDb_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OMDb API key is missing" }),
    };
  }

  try {
    let url = "";

    if (params.query) {
      // Search for movies by title
      url = `https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&s=${params.query}`;
    } else if (params.id) {
      // Fetch movie details by ID
      url = `https://www.omdbapi.com/?apikey=${OMDb_API_KEY}&i=${params.id}`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing query or id parameter" }),
      };
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: data.Error || "Not found" }),
      };
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
