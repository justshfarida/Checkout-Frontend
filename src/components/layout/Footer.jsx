import "./Footer.css";

export default function Footer({ theme, onThemeToggle }) {
  return (
    <footer className="footer">
      <span className="footer__text">React Hooks Project</span>

      <button
        className="footer__theme-toggle"
        type="button"
        onClick={onThemeToggle}
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </footer>
  );
}