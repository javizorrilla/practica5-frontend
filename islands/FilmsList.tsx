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

  const addFilmtoProject = (film: Film, project: Project) => {
    project.filmsID.push(film._id);
    setProjects(projects.map((p) => p.name ? project : p));
    console.log(`Added film ${film.name} to project ${project.name}`);
  };

  const saveProjects = async (projects: Project[]) => {
    try {
    const response = await fetch("https://filmapi.vercel.app/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({projects})
    });

    if (!response || response.status !== 200) {
      throw new Error("Failed to save projects");
    }
  } catch(error) {
    console.error("Error saving projects: ", error);
    throw error;
  }
}

  // Create a new project. At the start will be empty, then we can add films to it
  const createProject = () => {
    const newProject = {
      name: newProjectName,
      filmsID: [],
    };
    const updatedProjects = [...projects, newProject];
    setProjects([...projects, newProject]);
    setShowModal(false);
    setNewProjectName("");
    saveProjects(updatedProjects);
  };

  // Select a project to add films to it
  const selectProject = () => {
    if (selectedProject !== "") {
      const project = projects.find((p) => p.name === selectedProject);
      if (project) {
        console.log(`Selected project: ${selectedProject}`);
      }
    }
    setShowModal(true);
    setSelectedProject("");
  };

  const brands = Array.from(new Set(filmArray.map((film) => film.brand)))
    .sort(); // Brands alphabetically ordered
  const isos = Array.from(new Set(filmArray.map((film) => film.iso))).sort(); // ISOs ascendant ordered

  const filmsFilter = filmArray.filter((film) => {
    return (
      (!selectedBrand || film.brand === selectedBrand) &&
      (!selectedISO || film.iso.toString() === selectedISO) &&
      (!selectedFormat120 || film.formatOneTwenty === selectedFormat120) &&
      (!selectedFormat35 || film.formatThirtyFive === selectedFormat35) &&
      (!selectedColor || film.color === selectedColor) &&
      (!selectedName ||
        film.name.toLowerCase().includes(selectedName.toLowerCase()))
    );
  });

  useEffect(() => {
    setFilms(filmArray);
  }, [films]);

  return (
    <div>
      <h1>FILMS</h1>
      <div>
        <label for="brand">Select a brand:</label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.currentTarget.value)}
        >
          <option value="">All brands</option>
          {brands.map((brand) => {
            return <option key={brand} value={brand}>{brand}</option>;
          })}
        </select>
      </div>

      <div>
        <label for="iso">Select an ISO:</label>
        <select
          value={selectedISO}
          onChange={(e) => setSelectedISO(e.currentTarget.value)}
        >
          <option value="">All ISOs</option>
          {isos.map((iso) => {
            return <option key={iso} value={iso}>{iso}</option>;
          })}
        </select>
      </div>

      <div>
        <label for="format120">Select 120 format:</label>
        <input
          type="checkbox"
          checked={selectedFormat120}
          onChange={(e) => setSelectedFormat120(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label for="format35">Select 35 format:</label>
        <input
          type="checkbox"
          checked={selectedFormat35}
          onChange={(e) => setSelectedFormat35(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label for="color">Select color:</label>
        <input
          type="checkbox"
          checked={selectedColor}
          onChange={(e) => setSelectedColor(e.currentTarget.checked)}
        />
      </div>

      <div>
        <label for="name">Select film name (then enter to search):</label>
        <input
          type="text"
          value={selectedName}
          onChange={(e) => setSelectedName(e.currentTarget.value)}
        />
      </div>
      <div class="films-grid">
        {filmsFilter.length > 0
          ? filmsFilter.map((f) => {
            return (
              <div key={f._id} class="film-item">
                <ShowFilms
                  film={f}
                />
                <button onClick={() => setShowModal(true)}>Add film to Project</button>
              </div>
            );
          })
          : (
            <strong>
              <p>No films found with the selected properties!</p>
            </strong>
          )}
      </div>

      {showModal && (
        <div class="modal">
          <div class="modal-content">
            <span class="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add film to project</h2>
            {projects.length > 0
              ? (
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.currentTarget.value)}
                >
                  <option value="">Select an existing project</option>
                  {projects.map((project) => (
                    <option value={project.name}>{project.name}</option>
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
            {projects && <button onClick={() => {
              const project = projects.find((p) => p.name === selectedProject);
              if(project) {
                filmsFilter.forEach(film => addFilmtoProject(film, project));
                setShowModal(false);
              }
              }}>Add to selected project</button>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmsList;
