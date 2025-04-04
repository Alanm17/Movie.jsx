import { useState, useEffect } from "react";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }

        setIsLoading(true);
        setError("");

        const res = await fetch(
          `/.netlify/functions/fetchMovies?query=${query}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();

        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          throw new Error(data.error || "No movies found");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setMovies([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
