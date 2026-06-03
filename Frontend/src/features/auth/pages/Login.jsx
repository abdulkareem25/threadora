import React, { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import '../styles/auth.css';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';

/* ─── Icons ─────────────────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ─── Component ──────────────────────────────────────────────────────── */
const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { loading, error } = useSelector((s) => s.auth);

  const [credential, setCredential] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const credentialId    = useId();
  const passwordId = useId();

  const validate = () => {
    const errors = {};

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential.trim());
    const isPhone = /^[0-9]{10}$/.test(credential.trim());

    if (!isEmail && !isPhone)
      errors.credential = 'Enter a valid email address or phone number.';

    if (!password)
      errors.password = 'Password is required.';
    else if (password.length < 8)
      errors.password = 'Password must be at least 8 characters.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    const success = await loginUser(credential.trim(), password);
    
    if (success) {
      navigate('/');
      setCredential('');
      setPassword('');
    }
  };

  return (
    <div className="auth-page">
      <Header utilityLink={{ label: 'Join Us', to: '/signup' }} />

      <main className="auth-body" id="main-content">
        <div className="auth-card">

          <header className="auth-header">
            <p className="auth-eyebrow">Welcome back</p>
            <h1 className="auth-heading">Sign In</h1>
            <p className="auth-subheading">
              Access your account, orders, and member benefits.
            </p>
          </header>

          {error && (
            <div className="auth-global-error" role="alert" aria-live="assertive">
              <AlertIcon />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Sign in form">

            {/* Email or Phone Number */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={credentialId}>Email or Phone number</label>
              <div className="auth-input-wrap">
                <input
                  id={credentialId}
                  type="text"
                  className={`auth-input${fieldErrors.credential ? ' is-error' : ''}`}
                  placeholder="you@example.com or 1234567890"
                  value={credential}
                  onChange={(e) => {
                    setCredential(e.target.value);
                    setFieldErrors((p) => ({ ...p, credential: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.credential}
                  aria-describedby={fieldErrors.credential ? `${credentialId}-error` : undefined}
                />
              </div>
              {fieldErrors.credential && (
                <span id={`${credentialId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.credential}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={passwordId}>Password</label>
              <div className="auth-input-wrap">
                <input
                  id={passwordId}
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input has-toggle${fieldErrors.password ? ' is-error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? `${passwordId}-error` : undefined}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {fieldErrors.password && (
                <span id={`${passwordId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Forgot */}
            <div className="auth-forgot">
              <a href="#" aria-label="Forgot your password? Reset it here">Forgot password?</a>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              id="login-submit-btn"
              className="auth-btn-primary"
              disabled={loading}
              aria-label="Sign in to your account"
            >
              {loading
                ? <><span className="auth-btn-spinner" aria-hidden="true" />Signing in…</>
                : 'Sign In'
              }
            </button>

            <div className="auth-divider" role="separator" aria-hidden="true">or continue with</div>

            <div className="auth-social-row">
              <button type="button" id="login-google-btn" className="auth-btn-social" aria-label="Sign in with Google">
                <GoogleIcon /> Google
              </button>
              <button type="button" id="login-apple-btn" className="auth-btn-social" aria-label="Sign in with Apple">
                <AppleIcon /> Apple
              </button>
            </div>

            <p className="auth-footer-link">
              Don't have an account?{' '}
              <Link to="/signup" id="login-create-account-link">Create account</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
