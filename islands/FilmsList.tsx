import { useEffect, useState } from "preact/hooks";
import { FunctionComponent } from "preact";
import { Film, Project } from "../types.ts";
import ShowFilms from "../components/ShowFilms.tsx";

type FilmsProps = {
  filmArray: Film[];
};

const FilmsList: FunctionComponent<FilmsProps> = ({ filmArray }) => {
  const [films, setFilms] = useState<Film[]>(filmArray);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedISO, setSelectedISO] = useState<string>("");
  const [selectedFormat120, setSelectedFormat120] = useState<boolean>(false);
  const [selectedFormat35, setSelectedFormat35] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<boolean>(false);
  const [selectedName, setSelectedName] = useState<string>("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);

  const addFilmToProject = (film: Film, project: Project) => {
    project.filmsID.push(film._id);
    setProjects(projects.map((p) => (p.name === project.name ? project : p)));
    console.log(`Added film ${film.name} to project ${project.name}`);
  };

  const createProject = async () => {
    const newProject = {
      name: newProjectName,
      filmsID: [],
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setShowModal(false);
    setNewProjectName("");
    await saveProjects(updatedProjects);
  };

  const selectProject = () => {
    if (selectedProject !== "") {
      const project = projects.find((p) => p.name === selectedProject);
      if (project && currentFilm) {
        addFilmToProject(currentFilm, project);
        setShowModal(false);
      }
    }
  };

  const saveProjects = async (projects: Project[]) => {
    try {
      const fetchProjects = await fetch("https://filmapi.vercel.app/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projects }),
      });
      const fetchResponseJson = await fetchProjects.json();
      console.log("Projects saved successfully", fetchResponseJson);
    } catch (error) {
      console.error("Error saving projects: ", error);
      throw error;
    }
  };

  const brands = Array.from(new Set(filmArray.map((film) => film.brand))).sort(); // Brands alphabetically ordered
  const isos = Array.from(new Set(filmArray.map((film) => film.iso))).sort(); // ISOs ascendant ordered

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://filmapi.vercel.app/api/projects");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const filteredFilms = filmArray.filter((film) => {
      return !selectedISO || film.iso.toString() === selectedISO;
    });

    const hasFormat120 = filteredFilms.some((film) => film.formatOneTwenty);
    const hasFormat35 = filteredFilms.some((film) => film.formatThirtyFive);

    setSelectedFormat120(hasFormat120);
    setSelectedFormat35(hasFormat35);
  }, [selectedISO, filmArray]);

  const filmsFilter = films.filter((film) => {
    return (
      (!selectedBrand || film.brand === selectedBrand) &&
      (!selectedISO || film.iso.toString() === selectedISO) &&
      (!selectedFormat120 || film.formatOneTwenty === selectedFormat120) &&
      (!selectedFormat35 || film.formatThirtyFive === selectedFormat35) &&
      (!selectedColor || film.color === selectedColor) &&
      (!selectedName || film.name.toLowerCase().includes(selectedName.toLowerCase()))
    );
  });

  return (
    <div>
      <h1>FILMS</h1>
      <div>
        <label htmlFor="brand">Select a brand:</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.currentTarget.value)}
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="iso">Select an ISO:</label>
        <select
          value={selectedISO}
          onChange={(e) => setSelectedISO(e.currentTarget.value)}
        >
          <option value="">All ISOs</option>
          {isos.map((iso) => (
            <option key={iso} value={iso}>{iso}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="format120">Select 120 format:</label>
        <input
          type="checkbox"
          checked={selectedFormat120}
          onChange={(e) => setSelectedFormat120(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label htmlFor="format35">Select 35 format:</label>
        <input
          type="checkbox"
          checked={selectedFormat35}
          onChange={(e) => setSelectedFormat35(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label htmlFor="color">Select color:</label>
        <input
          type="checkbox"
          checked={selectedColor}
          onChange={(e) => setSelectedColor(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label htmlFor="name">Select film name (then enter to search):</label>
        <input
          type="text"
          value={selectedName}
          onChange={(e) => setSelectedName(e.currentTarget.value)}
        />
      </div>

      <div className="films-grid">
        {filmsFilter.length > 0 ? (
          filmsFilter.map((f) => (
            <div key={f._id} className="film-item">
              <ShowFilms film={f} />
              <button onClick={() => {
                setCurrentFilm(f);
                setShowModal(true);
              }}>Add film to Project</button>
            </div>
          ))
        ) : (
          <strong>
            <p>No films found with the selected properties!</p>
          </strong>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add film to project</h2>
            {projects.length > 0 ? (
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.currentTarget.value)}
              >
                <option value="">Select an existing project</option>
                {projects.map((project) => (
                  <option key={project.name} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  type="text"
                  value={newProjectName}
                  placeholder="Enter new project name"
                  onChange={(e) => setNewProjectName(e.currentTarget.value)}
                />
              </div>
            )}
            <button onClick={createProject}>Create Project</button>
            {projects && (
              <button onClick={selectProject}>
                Add to selected project
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmsList;
