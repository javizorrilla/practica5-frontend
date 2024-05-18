import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import FilmsList from "../islands/FilmsList.tsx";
import { Film } from "../types.ts";
import Axios from "npm:axios";

export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext<unknown, Film[]>) => {
    try {
      const response = await Axios.get<Film[]>(
        "https://filmapi.vercel.app/api/films",
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to connect to films data from API");
      }
      const filmsList = response.data;
      return ctx.render(filmsList);
    } catch (error) {
      throw new Error("Failed to fetch films data");
    }
  }
};

const Page = (props: PageProps<Film[]>) => {
  const films = props.data;
  return (
    <div>
      <FilmsList filmArray={films}/>
    </div>
  );
};

export default Page;
