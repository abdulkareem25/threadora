import React from 'react';

/**
 * Footer — minimal site footer for auth pages.
 *
 * Mirrors the component.footer spec from DESIGN.md:
 * hairline top border, copyright left, nav links right.
 */
const Footer = () => (
  <footer className="auth-page-footer" aria-label="Site footer">
    <span className="auth-page-footer-copy">© 2025 Threadora. All rights reserved.</span>
    <nav className="auth-page-footer-links" aria-label="Footer navigation">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Cookie Policy</a>
      <a href="#">Help</a>
    </nav>
  </footer>
);

export default Footer;
