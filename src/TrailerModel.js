import { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player/youtube";
import axios from "axios";

function Trailer({ movieTitle, onClose }) {
  const [trailerState, setTrailerState] = useState({
    youtubeId: null,
    loading: false,
    error: null,
  });

  const fetchTrailer = useCallback(async () => {
    setTrailerState({ youtubeId: null, loading: true, error: null });

    try {
      const controller = new AbortController();
      const baseUrl =
        process.env.NODE_ENV === "development" ? "http://localhost:8888" : "";

      const response = await axios.get(
        `${baseUrl}/.netlify/functions/youtube?query=${encodeURIComponent(
          movieTitle
        )}`,
        {
          timeout: 10000,
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }
      );

      const videoId = response.data.videoId;

      if (videoId) {
        setTrailerState({ youtubeId: videoId, loading: false, error: null });
      } else {
        setTrailerState({
          youtubeId: null,
          loading: false,
          error: "No official trailer found.",
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Something went wrong while fetching the trailer.";
      setTrailerState({
        youtubeId: null,
        loading: false,
        error: errorMsg,
      });
    }
  }, [movieTitle]);

  useEffect(() => {
    fetchTrailer();
    return () => {}; // Optionally handle cleanup if necessary
  }, [fetchTrailer]);

  const handleClose = useCallback(() => {
    setTrailerState({ youtubeId: null, loading: false, error: null });
    onClose?.();
  }, [onClose]);

  if (trailerState.loading) {
    return (
      <div className="trailer-loading-state">
        <div className="loading-spinner" aria-label="Loading trailer" />
        <p>Searching for official trailer...</p>
      </div>
    );
  }

  if (trailerState.error) {
    return (
      <div className="trailer-error-state">
        <p>{trailerState.error}</p>
        <button onClick={fetchTrailer}>Try Again</button>
      </div>
    );
  }

  if (!trailerState.youtubeId) {
    return (
      <div className="trailer-unavailable">
        <p>No official trailer available</p>
        <button
          onClick={() =>
            window.open(
              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                movieTitle + " official trailer"
              )}`,
              "_blank"
            )
          }
        >
          Search YouTube
        </button>
      </div>
    );
  }

  return (
    <div className="trailer-modal-overlay" onClick={handleClose}>
      <div
        className="trailer-player-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-trailer-button" onClick={handleClose}>
          ✕
        </button>
        <div className="react-player-wrapper">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerState.youtubeId}`}
            controls
            playing={false}
            width="100%"
            height="100%" // This makes the player fill its parent container
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  autoplay: 1,
                  origin: window.location.origin,
                },
              },
            }}
            onError={(error) => {
              console.error("YouTube player error:", error);
              setTrailerState((prev) => ({
                ...prev,
                error: "Failed to play video",
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Trailer;
