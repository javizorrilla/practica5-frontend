import { FunctionComponent } from "preact";
import { Film } from "../types.ts";

type FilmsProps = {
  film: Film;
};

const ShowFilms: FunctionComponent<FilmsProps> = ({ film }) => {
  return (
    <div class="film-container">
      <h2>{film.name.toUpperCase()}</h2>
      <div class="film-attributes" key={film._id}>
        <p><strong>Brand:</strong> {film.brand}</p>
        <p><strong>ISO:</strong> {film.iso}</p>
        <p><strong>Format 120:</strong> {film.formatOneTwenty ? "✅" : "❌"}</p>
        <p><strong>Format 35:</strong> {film.formatThirtyFive ? "✅" : "❌"}</p>
        <p><strong>Color:</strong> {film.color ? "Color" : "Black & White"}</p>
        <img src={film.staticImageUrl} alt={film.name} />
      </div>
    </div>
  );
};

export default ShowFilms;
