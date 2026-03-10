import { useState, useEffect } from "react";

const GENRES = [
  { label: "🔥 Action", query: "action" },
  { label: "🎭 Drama", query: "drama" },
  { label: "🚀 Sci-Fi", query: "science fiction" },
  { label: "😂 Comedy", query: "comedy" },
  { label: "👻 Horror", query: "horror" },
];

export function RecommendedMovies({ onHandleID }) {
  const [activeGenre, setActiveGenre] = useState(GENRES[0]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecommended() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/.netlify/functions/fetchMovies?query=${encodeURIComponent(
            activeGenre.query
          )}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          setMovies(data.slice(0, 12));
        } else {
          setMovies([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommended();
    return () => controller.abort();
  }, [activeGenre]);

  return (
    <div className="recommended-section">
      <div className="recommended-header">
        <h2 className="recommended-title">
          <span className="title-accent">Discover</span> Movies
        </h2>
        <p className="recommended-subtitle">
          Explore top picks across genres -  click to view details
        </p>
      </div>

      {/* Genre Tabs */}
      <div className="genre-tabs">
        {GENRES.map((genre) => (
          <button
            key={genre.query}
            className={`genre-tab ${activeGenre.query === genre.query ? "active" : ""
              }`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre.label}
          </button>
        ))}
      </div>

      {/* Movie Cards Row */}
      {isLoading ? (
        <div className="recommended-loader">
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <div className="recommended-scroll">
          {movies.length === 0 && (
            <p className="no-results">No movies found for this genre.</p>
          )}
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="rec-card"
              onClick={() => onHandleID(movie.imdbID)}
            >
              <div className="rec-card-poster-wrap">
                {movie.Poster && movie.Poster !== "N/A" ? (
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="rec-card-poster"
                  />
                ) : (
                  <div className="rec-card-no-poster">🎬</div>
                )}
                <div className="rec-card-overlay">
                  <span className="rec-play-btn">▶</span>
                </div>
              </div>
              <div className="rec-card-info">
                <h4 className="rec-card-title">{movie.Title}</h4>
                <span className="rec-card-year">{movie.Year}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
