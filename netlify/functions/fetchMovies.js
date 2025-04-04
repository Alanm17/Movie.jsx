const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { query } = event.queryStringParameters;
  const OMDb_API_KEY = process.env.OMDb_API_KEY; // Set in Netlify Dashboard

  try {
    const url = `http://www.omdbapi.com/?apikey=${OMDb_API_KEY}&s=${query}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Movie not found!" }),
      };
    }

    return { statusCode: 200, body: JSON.stringify(data.Search || []) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
