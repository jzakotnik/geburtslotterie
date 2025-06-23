import React from "react";
import { Dices } from "lucide-react";

export default function StyledButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#fff",
        background: "linear-gradient(135deg, #003300 0%, #000033 100%)",
        border: "none",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        transition: "transform 0.1s ease, box-shadow 0.1s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "2px solid #66ff66";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <Dices size={20} />
      {children}
    </button>
  );
}
