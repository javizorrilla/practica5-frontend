import { FunctionComponent } from "preact";
import { Film } from "../types.ts";

type FilmsProps = {
  film: Film;
};

const ShowFilms: FunctionComponent<FilmsProps> = (
  { film },
) => {

  return (
    <div class="film-container">
      <h2>{film.name}</h2>
      <div class="film-attributes" key={film._id}>        
        <p>Brand: {film.brand}</p>
        <p>ISO: {film.iso}</p>
        <p>Format 120: {film.formatOneTwenty ? "Yes" : "No"}</p>
        <p>Format 35: {film.formatThirtyFive ? "Yes" : "No"}</p>
        <p>Color: {film.color ? "Color" : "Black & White"}</p>
        <img src={film.staticImageUrl} alt={film.name} />
      </div>
    </div>
  );
};

export default ShowFilms;
