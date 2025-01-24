import { MovieWatched } from "./MovieWatched";

export function WatchedMovieList({ watched, onHandleRemove }) {
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
