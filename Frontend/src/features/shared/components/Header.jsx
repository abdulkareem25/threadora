import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header — site-wide header for auth pages.
 *
 * Renders the utility bar (secondary nav) and the primary nav with the
 * Threadora logo mark + wordmark.
 *
 * @param {{ utilityLink?: { label: string, to: string } }} props
 *   utilityLink  — the right-most contextual link in the utility bar
 *                  e.g. { label: 'Join Us', to: '/signup' }
 *                  or   { label: 'Sign In',  to: '/login'  }
 */
const Header = ({ utilityLink }) => (
  <header>
    {/* Utility bar — component.utility-bar */}
    {/* <div className="auth-utility-bar" role="navigation" aria-label="Secondary navigation">
      <a href="#">Find a Store</a>
      <a href="#">Help</a>
      {utilityLink && (
        <Link to={utilityLink.to}>{utilityLink.label}</Link>
      )}
    </div> */}

    {/* Primary nav — component.primary-nav */}
    <nav className="auth-nav" aria-label="Primary navigation">
      <Link to="/" className="auth-nav-logo" aria-label="Threadora — go to homepage">
        {/* Brand icon */}
        <span className="auth-nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            />
          </svg>
        </span>
        {/* Wordmark */}
        <span className="auth-nav-wordmark">Threadora</span>
      </Link>
    </nav>
  </header>
);

export default Header;
