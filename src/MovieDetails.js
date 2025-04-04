import { useState, useRef, useEffect } from "react";
import { Loader } from "./App";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import ReactPlayer from "react-player";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export function MovieDetails({
  selectedID,
  onAddWatched,
  watched,
  setSelectedID,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(
    watched.find((movie) => movie.imdbID === selectedID)?.userRating || null
  );
  const [showTrailer, setShowTrailer] = useState(false);
  const [youtubeId, setYoutubeId] = useState(null);
  const [error, setError] = useState(null);
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Genre: genre,
    Director: director,
  } = movie;

  // Fetch movie details from OMDB
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovieDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/.netlify/functions/function?id=${selectedID}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch movie details");

        const data = await res.json();
        if (data.Error) throw new Error(data.Error);

        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedID) fetchMovieDetails();

    return () => controller.abort();
  }, [selectedID]);

  // Fetch YouTube trailer
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrailer() {
      if (!title) return;

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            `${title} official trailer`
          )}&key=${YOUTUBE_API_KEY}&maxResults=1`,
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error("Failed to fetch trailer");

        const data = await response.json();
        setYoutubeId(data.items?.[0]?.id?.videoId || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Trailer error:", err);
        }
      }
    }

    fetchTrailer();
    return () => controller.abort();
  }, [title]);

  function handleAddToWatched() {
    const runtimeMinutes = runtime ? parseInt(runtime.split(" ")[0]) || 0 : 0;

    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating) || 0,
      runtime: runtimeMinutes,
      userRating,
      countRatingDesitions: countRef.current,
    };

    const isAlreadyWatched = watched.some(
      (movie) => movie.imdbID === selectedID
    );

    if (isAlreadyWatched) {
      setError("This movie is already in your list");
      setTimeout(() => setError(null), 3000);
    } else {
      onAddWatched(newWatchedMovie);
      handleGoBack();
    }
  }

  function handleGoBack() {
    setSelectedID(null);
  }

  const isSaved = watched.some((movie) => movie.imdbID === selectedID);

  useKey("Escape", handleGoBack);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "Movie App";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleGoBack}>
              &larr;
            </button>

            <img
              src={poster !== "N/A" ? poster : "/placeholder-movie.jpg"}
              alt={`Poster of ${title}`}
              onError={(e) => {
                e.target.src = "/placeholder-movie.jpg";
              }}
            />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>

              {youtubeId && (
                <button
                  className="btn-trailer"
                  onClick={() => setShowTrailer(true)}
                  aria-label="Play trailer"
                >
                  ▶ Play Trailer
                </button>
              )}

              {isSaved && (
                <p className="watched-badge">
                  Watched • Avg Rating:{" "}
                  {(
                    (Number(imdbRating) +
                      watched.find((m) => m.imdbID === selectedID)
                        ?.userRating) /
                    2
                  ).toFixed(1)}
                  ⭐
                </p>
              )}
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={28}
                onSetRating={setUserRating}
                initialRating={userRating}
              />

              {userRating > 0 && (
                <button
                  className="btn-add"
                  onClick={handleAddToWatched}
                  disabled={isSaved}
                >
                  {isSaved ? "Already Added" : "+ Add to list"}
                </button>
              )}

              {error && <p className="alert">{error}</p>}
            </div>

            <p className="plot">
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>

          {showTrailer && youtubeId && (
            <div className="trailer-modal">
              <div className="trailer-container">
                <button
                  className="btn-close-trailer"
                  onClick={() => setShowTrailer(false)}
                  aria-label="Close trailer"
                >
                  ✕
                </button>
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${youtubeId}`}
                  controls
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
