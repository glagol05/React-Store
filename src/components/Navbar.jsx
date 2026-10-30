function Navbar({ onGoHome }) {
    return (
        <nav className="navbar">
            <button className="navbar-logo" onClick={onGoHome}>
                Nordic Shop
            </button>
        </nav>
    );
}

export default Navbar;
