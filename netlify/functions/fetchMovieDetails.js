exports.handler = async (event) => {
  const { query } = event.queryStringParameters;
  const OMDb_API_KEY = process.env.OMDb_API_KEY;

  if (!movieId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing movieId parameter" }),
    };
  }

  try {
    const url = `http://www.omdbapi.com/?apikey=${OMDb_API_KEY}&i=${qu}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: data.Error || "Movie not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data), // Return the full movie object
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
