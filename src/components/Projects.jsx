import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

function Projects({ iso_a3 = "" }) {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "projects_with_iso.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch projects.json");
        return r.json();
      })
      .then(setProjects)
      .catch((e) => setError(e));
  }, []);

  if (error) return <p className="muted">Konnte Projekte nicht laden.</p>;
  if (!projects) return <div className="skel" aria-busy="true" />;

  const list = projects.filter((p) => p.iso_a3 === iso_a3);
  if (!list.length) return null;

  const sample = list.slice().sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <section className="projects" aria-live="polite">
      <h4>
        KfW Projekte <span className="badge">{list.length}</span>
      </h4>
      <ul>
        {sample.map((p) => (
          <li key={p.projnr}>
            <CheckCircle2 size={16} aria-hidden />
            <span>{p.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;
