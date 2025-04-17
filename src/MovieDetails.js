import { useEffect } from "react";
import { Loader } from "./App";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
// import ReactPlayer from "react-player";
import "./index.css";
import Trailer from "./TrailerModel";
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export function MovieDetails({
  isLoading,
  setUserRating,
  userRating,
  error,
  setError,
  countRef,
  selectedID,
  onAddWatched,
  watched,
  setSelectedID,
  title,
  year,
  poster,
  runtime,
  imdbRating,
  plot,
  released,
  actors,
  genre,
  director,
}) {
  // const [youtubeId, setYoutubeId] = useState(null);

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
        <div>
          <div>
            {" "}
            {!isLoading ? (
              title && <Trailer movieTitle={title} />
            ) : (
              <Loader />
            )}{" "}
          </div>
          <header>
            <button className="btn-back" onClick={handleGoBack}>
              &larr;
            </button>

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

              {userRating && (
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
        </div>
      )}
    </div>
  );
}
