import ThemeToggle from "../utils/ThemeToggle"
import "../index.css"
import styles from "../styles/Navbar.module.css"
function Navbar() {
    const {theme, toggleTheme} = ThemeToggle();

    return (
        <nav className="d-flex justify-content-between align-items-center py-3 px-4">
            <div>
                <p className="mb-0 fw-semi-bold" style={{fontSize: "21px"}}>GPTalks</p>
            </div> 
            <div className="d-flex align-items-center gap-4"> 
                <button onClick={toggleTheme} className={styles.theme_toggle_btn}>
                    {theme == "light" ? <i className="lni lni-moon-half-right-5 mb-0"></i> : <i class="lni lni-sun-1 mb-0"></i>}
                </button>
                <button className={styles.profile}>
                    <i class="fa-solid fa-regular fa-user text-white"></i>
                </button>
            </div>
        </nav>
     );
}

export default Navbar;