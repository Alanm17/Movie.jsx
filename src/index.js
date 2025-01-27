import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";
// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="blue" maxRating={5} onSetRating={setMovieRating} />
//       <p>This movie is rated {movieRating} stars</p>
//     </div>
//   );
// }
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating maxRating={5} defaultRating={5} onSetRating={() => {}} />
    <StarRating
      maxRating={5}
      size={20}
      color="orange"
      className={""}
      messages={["terrible", "bad", "okey", "good", "amazing"]}
      onSetRating={() => {}}
    />
    <Test /> */}
  </React.StrictMode>
);
