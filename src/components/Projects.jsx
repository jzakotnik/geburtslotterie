import React, { useEffect, useState } from "react";

function Projects({ iso_a3 = "" }) {
  const [projects, setProjects] = useState(null);
  console.log("Searching for iso code", iso_a3, projects);

  useEffect(() => {
    fetch("/projects_with_iso.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch projects.json");
        }
        return response.json();
      })
      .then((data) => setProjects(data))
      .catch((error) => {
        console.error("Error loading projects:", error);
      });
  }, []);

  if (!projects) {
    return <div>Loading projects...</div>;
  }

  // Filter projects by the iso_a3 prop
  const filteredProjects = projects.filter(
    (project) => project.iso_a3 === iso_a3
  );

  return (
    <div>
      <p>
        Aber es gibt <strong>{filteredProjects.length}</strong> KfW Projekte
        dort, welche das Land weiter entwickeln!
      </p>

      <p>Zum Beispiel:</p>
      {filteredProjects.length > 0 ? (
        <ul>
          {filteredProjects
            .slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map((project) => (
              <li key={project.projnr}>{project.title}</li>
            ))}
        </ul>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Projects;
