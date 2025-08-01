import ThemeToggle from "../utils/ThemeToggle"
import "../index.css"
function Navbar() {
    const {theme, toggleTheme} = ThemeToggle();

    return ( 
        <div>
            Navbar
            <button onClick={toggleTheme} style={{ marginLeft: "auto" }}>
                {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
            </button>
        </div>
     );
}

export default Navbar;