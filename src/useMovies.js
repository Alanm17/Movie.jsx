import { useState, useEffect } from "react";
const KEY = "3df616eb";
export function useMovies(query, handleGoBack) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchtheAPI() {
        try {
          if (query.length < 3) {
            // Skip API call if query is empty
            setMovies([]);
            setError("");
            return;
          }
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search || []);
          console.log(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }

          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }
      handleGoBack();
      fetchtheAPI();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
