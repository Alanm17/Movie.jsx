import { useEffect, useState } from "react";
import StarRating from "./StarRating";
const KEY = "3df616eb";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(
    localStorage.getItem("movieSearchQuery") || ""
  );
  const [selectedID, setSelectedID] = useState(null);
  useEffect(() => {
    // Sync query with localStorage
    localStorage.setItem("movieSearchQuery", query);
  }, [query]);
  function handleSelectedMovieID(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }
  function handleGoBack(id) {
    setSelectedID(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function onHandleRemove(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
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
            `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
          );
          if (!res.ok)
            throw new Error("something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found!");
          setMovies(data.Search || []);
          console.log(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }
      fetchtheAPI();
    },
    [query]
  );
  return (
    <>
      <NavBAr>
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBAr>
      <Main>
        {" "}
        <MovieList />
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onHandleID={handleSelectedMovieID} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              handleGoBack={handleGoBack}
              onAddWatched={handleAddWatched}
              watched={watched}
              setWatched={setWatched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMovieList
                watched={watched}
                onHandleRemove={onHandleRemove}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
function Loader() {
  return <p className="loader">Loading...</p>;
}
function Error({ message }) {
  return <p className="error">📛{message}</p>;
}
function NavBAr({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function SearchBar({ setQuery, query }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieDetails({
  selectedID,
  handleGoBack,
  onAddWatched,
  watched,
  setWatched,
}) {
  const [movieS, setMovieS] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(
    watched.find((movie) => movie.imdbID === selectedID) || null
  );
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
      runtime: Number(runtime) === NaN ? 0 : Number(runtime.split(" ").at(0)),
      userRating,
    };
    const isAlreadyWatched = watched.some(
      (movie) => movie.imdbID === selectedID
    );
    if (isAlreadyWatched) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else {
      onAddWatched(newWatchedMovie);
      handleGoBack();
    }
  }
  const isSaved = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  console.log(title, year);
  useEffect(
    function () {
      async function movieDetailed() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await res.json();
        console.log(data.Search);
        setMovieS(data);
        setIsLoading(false);
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
                  Watched
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

function MovieList({ movies, onHandleID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onHandleID={onHandleID} />
      ))}
    </ul>
  );
}
function Movie({ movie, onHandleID }) {
  return (
    <li onClick={() => onHandleID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummery({ watched }) {
  const avgImdbRating = average(
    watched
      .map((movie) => movie.imdbRating)
      .filter((rating) => !isNaN(rating) && rating > 0)
  ).toFixed(1);

  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched
      .map((movie) => movie.runtime)
      .filter((runtime) => !isNaN(runtime) && runtime > 0)
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMovieList({ watched, onHandleRemove }) {
  const [editingID, setEditingID] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const handleEdit = (id, currentRating) => {
    setEditingID(id); // Set the ID of the movie being edited
    setEditingRating(currentRating); // Set the current rating for editing
  };

  const handleRatingChange = (change) => {
    setEditingRating((prev) => Math.max(0, prev + change)); // Increment/Decrement the rating, ensuring it doesn't go below 0
  };

  const handleSave = (id) => {
    const updatedWatched = watched.map((movie) => {
      if (movie.imdbID === id) {
        return { ...movie, userRating: editingRating };
      }
      return movie;
    });
    // Call a function to update the watched state in parent (if necessary)
    // Example: onUpdateWatched(updatedWatched);
    setEditingID(null); // Close the editing mode
  };
  return (
    <ul className="list">
      {watched.map((movie) => (
        <MovieWatched
          movie={movie}
          key={movie.imdbID}
          onHandleRemove={onHandleRemove}
        />
      ))}
    </ul>
  );
}
function MovieWatched({ movie, onHandleRemove }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onHandleRemove(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
