import { useState, useRef, useEffect } from "react";
import { Loader } from "./App";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
const KEY = "3df616eb";

export function MovieDetails({
  selectedID,
  onAddWatched,
  watched,
  setSelectedID,
}) {
  const [movieS, setMovieS] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(
    watched.find((movie) => movie.imdbID === selectedID)?.userRating || null
  );
  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);
  const [showAlert, setShowAlert] = useState(false);
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
  } = movieS;

  function onHandleAdd() {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: isNaN(Number(runtime.split(" ").at(0)))
        ? 0
        : Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDesitions: countRef.current,
    };
    const isAlreadyWatched = watched.some(
      (movie) => movie.imdbID === selectedID
    );

    if (isAlreadyWatched) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else {
      handleGoBack();
      onAddWatched(newWatchedMovie);
    }
  }
  function handleGoBack() {
    setSelectedID(null);
  }
  const isSaved = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  console.log(title, year);
  useKey("Escape", function () {
    setSelectedID(null);
  });

  useEffect(
    function () {
      async function movieDetailed() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedID}&apikey=${KEY}`
        );
        const data = await res.json();
        console.log(data);
        setMovieS(data); // Setting the movieS state
        setIsLoading(false); // Setting the isLoading state
      }
      movieDetailed();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleGoBack}>
              &larr;
            </button>

            <img src={poster} alt="img of movie" />
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
              {isSaved ? (
                <p
                  style={{
                    color: "grey",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                  }}
                >
                  Watched & AvgRating{" "}
                  {((Number(imdbRating) + userRating) / 2).toFixed(2)}
                </p>
              ) : (
                ""
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
                <button className={"btn-add"} onClick={onHandleAdd}>
                  + Add to list
                </button>
              )}
              {showAlert && (
                <p className="alert">
                  Movie is already in the list with rating{" "}
                  <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                    {
                      watched.find((movie) => movie.imdbID === selectedID)
                        ?.userRating
                    }
                    {""} ⭐️
                  </span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
