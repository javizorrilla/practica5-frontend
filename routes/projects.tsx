import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Film, Project } from "../types.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

type ProjectsAndFilms = {
    projects: Project[];
    films: Film[];
}

export const handler: Handlers = {
    GET: async(req: Request, ctx: FreshContext<unknown, ProjectsAndFilms>) => {
        try {
            const response = await fetch("https://filmapi.vercel.app/api/films");
            
            if (!response || response.status !== 200) {
              throw new Error("Failed to connect to films data from API");
            }
            const films = await response.json();

            const cookies = getCookies(req.headers).projects;
            if(!cookies) return ctx.render({projects: [], films})
            
            const projects = JSON.parse(cookies);
            return ctx.render({projects, films});

        } catch (error) {
            throw new Error("Failed to fetch films data");
        }
    },

    POST: async (req: Request, ctx: FreshContext<unknown, ProjectsAndFilms>) => {
        const { name, filmsID } = await req.json();
        const cookies = getCookies(req.headers).projects;
        const projects = cookies ? JSON.parse(cookies) : [];
    
        const newProject: Project = { name, filmsID };
        projects.push(newProject);
    
        const headers = new Headers();
        setCookie(headers, { name: "projects", value: JSON.stringify(projects), path: "/" });
    
        return new Response(JSON.stringify({ success: true }), { headers });
      }
};

const Page = (props: PageProps<ProjectsAndFilms>) => {
    const projects = props.data.projects;
    const films = props.data.films;
    if(projects.length === 0) 
        return (
    <div>
        <h1>PROJECTS</h1>
        <strong><p>No projects</p></strong>
        </div>
    );

    return (
        <div>
            <h1>PROJECTS</h1>
            <div>
                {projects.map((project) => {
                    return (
                        <div>
                            <h2>{project.name}</h2>
                            <h3>Films</h3>
                            <div>
                                {films.filter((film) => project.filmsID.includes(film._id)).map((film) => {
                                    return (
                                        <div>
                                            <h4>{film.name}</h4>
                                            <p>{film.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Page;