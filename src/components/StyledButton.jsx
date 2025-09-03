import { Dices } from "lucide-react";

export default function StyledButton({ onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      className="btn"
      disabled={disabled}
      aria-disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        console.log("[Button] clicked");
        onClick?.(e);
      }}
    >
      <Dices size={18} />
      {children}
    </button>
  );
}
