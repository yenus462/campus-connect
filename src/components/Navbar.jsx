
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  }

  return (
    <nav className="navbar">
      <a className="navbar-logo" href="#dashboard">
        CampusConnect
      </a>

      <div className="navbar-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#my-courses">My Courses</a>
        <a href="#course-catalog">Course Catalog</a>
      </div>

      <div className="navbar-actions">
        <p className="navbar-subtitle">University Student Portal</p>

        <button
          className="theme-button"
          onClick={toggleDarkMode}
          aria-label="Toggle light and dark mode"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
