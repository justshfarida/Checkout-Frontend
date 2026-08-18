export default function Footer({ theme, onThemeToggle }) {
  return (
    <footer>
      <span>React Hooks Project</span>

      <button className="theme-toggle" type="button" onClick={onThemeToggle}>
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </footer>
  );
}
