import { Movie } from "./Movie";

export function MovieList({ movies, onHandleID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onHandleID={onHandleID} />
      ))}
    </ul>
  );
}
