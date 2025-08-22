import ThemeToggle from "../utils/ThemeToggle"
import "../index.css"
import styles from "../styles/Navbar.module.css"
import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {

    const {theme, toggleTheme} = ThemeToggle();
    const {
        isAuthenticated,
        loginWithRedirect: login, 
        logout: auth0Logout, 
        user, 
    } = useAuth0();

    const signup = () =>
        login({ authorizationParams: { screen_hint: "signup" } });

    const logout = () =>
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });

    console.log(user);
    return (
        <>
        <nav className="d-flex justify-content-between align-items-center py-3 px-4">
            <div>
                <p className="mb-0 fw-semi-bold" style={{fontSize: "21px"}}>GPTalks</p>
            </div> 
            <div className="d-flex align-items-center gap-4"> 

                <button onClick={toggleTheme} className={styles.theme_toggle_btn}>
                    {theme == "light" ? <i className="lni lni-moon-half-right-5 mb-0"></i> : <i class="lni lni-sun-1 mb-0"></i>}
                </button>       

                <button id={styles.profile}>
                    <i class="fa-solid fa-regular fa-user text-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></i>
                    <ul class="dropdown-menu" style={{padding: "0.4rem", backgroundColor: 'var(--sidebar-color)', border: "1px solid #d3cfcf3e"}}>
                        
                        <li class="dropdown-item" onClick={toggleTheme} style={{fontSize: "0.8rem", marginTop: "0"}}>
                                {
                                    theme == "light" ? (
                                        <span class="d-flex align-items-center" style={{fontSize: "12px"}}>
                                            <i className="lni lni-moon-half-right-5 mb-0" style={{marginRight: "0.4rem", fontSize: "14px"}}></i> Dark mode
                                        </span>
                                    ) : (
                                        <span class="d-flex align-items-center" style={{fontSize: "12px"}}>
                                            <i class="lni lni-sun-1 mb-0" style={{marginRight: "0.4rem", fontSize: "14px"}}></i> Light mode
                                        </span>
                                    )
                                }
                        </li>
                        <li class="dropdown-item" onClick={isAuthenticated ? logout : signup} style={{fontSize: "0.8rem", marginTop: "0"}}>
                            <span style={{fontSize: "12px"}}>
                                {
                                    isAuthenticated ?
                                    (   
                                        <>
                                            <i class="fa-solid fa-arrow-right-from-bracket" style={{marginRight: "0.4rem"}}></i> Logout
                                        </>
                                    ) : (
                                        
                                        <>
                                            <i class="fa-solid fa-arrow-right-to-bracket" style={{marginRight: "0.4rem"}}></i> Signup / Login
                                        </>
                                    )
                                }

                            </span>
                        </li>
                    </ul>
                </button>

            </div>
        </nav>
        </>
        
     );
}

export default Navbar;