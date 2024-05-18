import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "npm:axios";
import { Film } from "../../types.ts";
import ShowFilms from "../../components/ShowFilms.tsx";

export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext<unknown, Film[]>) => {
    const { id } = ctx.params;
    console.log(id);
    try {
      const response = await Axios.get<Film[]>(
        `https://filmapi.vercel.app/api/films/${id}`
      );
      if (!response || response.status !== 200) {
        throw new Error("Failed to connect to films data from API");
      }
      const filmData = response.data;
      return ctx.render(filmData);
    } catch (error) {
      throw new Error("Failed to fetch films data");
    }
  },
};

const Page = (props: PageProps<Film>) => {
  const f = props.data;
  return (
    <ShowFilms film={f}/>
  );
};

export default Page;
