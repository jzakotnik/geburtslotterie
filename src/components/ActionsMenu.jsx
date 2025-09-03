import { MoreHorizontal, Github, HelpCircle, Link as LinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ActionsMenu({ onHelp }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!btnRef.current) return;
      if (!btnRef.current.parentElement.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="menu">
      <button
        ref={btnRef}
        type="button"
        className="iconBtn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Mehr"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div role="menu" className="menu-pop">
          <a
            role="menuitem"
            className="menu-item"
            href="https://github.com/jzakotnik"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            <Github size={16} /> GitHub
          </a>
          <button
            role="menuitem"
            className="menu-item"
            onClick={() => { setOpen(false); onHelp?.(); }}
          >
            <HelpCircle size={16} /> Hilfe
          </button>
          <button
            role="menuitem"
            className="menu-item"
            onClick={async () => {
              await navigator.clipboard.writeText(window.location.href);
              setOpen(false);
            }}
          >
            <LinkIcon size={16} /> Link kopieren
          </button>
        </div>
      )}
    </div>
  );
}
