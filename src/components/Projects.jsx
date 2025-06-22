import React, { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    fetch("/projects.json")
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

  return (
    <div>
      <h1>Projects</h1>
      <pre>{JSON.stringify(projects, null, 2)}</pre>
    </div>
  );
}

export default Projects;
