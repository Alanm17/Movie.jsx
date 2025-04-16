import { useEffect, useRef, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { NavBAr } from "./NavBAr";
import { SearchBar } from "./SearchBar";
import { NumResults } from "./NumResults";
import { Main } from "./Main";
import { Box } from "./Box";
import { MovieDetails } from "./MovieDetails";
import { MovieList } from "./MovieList";
import { WatchedSummery } from "./WatchedSummery";
import { WatchedMovieList } from "./WatchedMovieList";
import { useMovies } from "./useMovies";

import Footer from "./Footer";
import TrailerModel from "./TrailerModel";

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const { movies } = useMovies(query);
  const [userRating, setUserRating] = useState(
    watched.find((movie) => movie.imdbID === selectedID)?.userRating || null
  );
  const countRef = useRef(0);
  useEffect(() => {
    // Sync query with localStorage
    localStorage.setItem("movieSearchQuery", query);
  }, [query]);
  function handleSelectedMovieID(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }
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

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/.netlify/functions/fetchMovieDetails?movieId=${selectedID}`,
          {
            signal: controller.signal,
          }
        );

        const data = await res.json();
        setMovie(data);
      } catch (err) {
        if (!err.name === "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [selectedID]);
  // function handleGoBack(id) {
  //   setSelectedID(null);
  // }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function onHandleRemove(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

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
            <>
              <MovieDetails
                selectedID={selectedID}
                onAddWatched={handleAddWatched}
                watched={watched}
                setWatched={setWatched}
                setSelectedID={setSelectedID}
                title={title}
                year={year}
                poster={poster}
                runtime={runtime}
                imdbRating={imdbRating}
                plot={plot}
                released={released}
                actors={actors}
                genre={genre}
                director={director}
                userRating={userRating}
                setUserRating={setUserRating}
                countRef={countRef}
                error={error}
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}

                // optional, for trailer
              />
              
            </>
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
      <Footer />
    </>
  );
}
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export function Loader() {
  return <p className="loader">Loading...</p>;
}
function Error({ message }) {
  return <p className="error">📛{message}</p>;
}
