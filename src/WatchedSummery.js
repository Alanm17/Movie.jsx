import { average } from "./App";

export function WatchedSummery({ watched }) {
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
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
