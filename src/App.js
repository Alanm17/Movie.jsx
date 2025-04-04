import { useEffect, useState } from "react";
import { useMovies } from "./useMovies";
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
import Footer from "./Footer";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [selectedID, setSelectedID] = useState(null);
  useEffect(() => {
    // Sync query with localStorage
    localStorage.setItem("movieSearchQuery", query);
  }, [query]);
  function handleSelectedMovieID(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }
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
            <MovieDetails
              selectedID={selectedID}
              // handleGoBack={handleGoBack}
              onAddWatched={handleAddWatched}
              watched={watched}
              setWatched={setWatched}
              setSelectedID={setSelectedID}
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
