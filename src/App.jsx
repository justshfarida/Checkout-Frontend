import StorePage from "./pages/StorePage";
import { useLocalStorage } from "./hooks/useLocalStorage";

const THEME_STORAGE_KEY = "game-items-store-theme";

export default function App() {
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, "dark");

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  }

  return (
    <div className={`page ${theme}`} id="top">
      <StorePage theme={theme} onThemeToggle={toggleTheme} />
    </div>
  );
}
