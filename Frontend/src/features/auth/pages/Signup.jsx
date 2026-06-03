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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BuyerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const SellerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

/* ─── Password strength ──────────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return null;
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)]
    .filter(Boolean).length;
  if (score <= 1) return { level: 'weak', label: 'Weak', bars: 1 };
  if (score === 2) return { level: 'fair', label: 'Fair', bars: 2 };
  if (score === 3) return { level: 'good', label: 'Good', bars: 3 };
  return { level: 'strong', label: 'Strong', bars: 4 };
};

/* ─── Component ──────────────────────────────────────────────────────── */
const Signup = () => {
  const navigate = useNavigate();
  const { signupUser } = useAuth();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [role, setRole] = useState('buyer');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  // const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const pwId = useId();
  const cpwId = useId();
  const roleId = useId();
  // const termsId = useId();

  const strength = getStrength(form.password);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
    else if (form.fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters.';
    if (!form.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      errors.email = 'Enter a valid email address.';
    if (!form.phone.trim()) errors.phone = 'Phone number is required.';
    else if (!/^[0-9]{10}$/.test(form.phone.trim()))
      errors.phone = 'Enter a valid 10-digit phone number.';
    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';
    // if (!agreed) errors.agreed = 'You must agree to the Terms & Conditions and Privacy Policy.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    const success = await signupUser(
      form.fullName.trim(), form.email.trim(), form.phone.trim(),
      form.password, form.confirmPassword, role,
    );
    if (success) {
      setSubmitted(true);
      setTimeout(() => navigate('/login'), 1800);
    }
  };

  /* ─ Success screen ─ */
  if (submitted) {
    return (
      <div className="auth-page">
        <Header utilityLink={{ label: 'Sign In', to: '/login' }} />
        <div className="auth-body" style={{ alignItems: 'center' }}>
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--color-success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="var(--color-canvas)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="auth-heading" style={{ fontSize: 36 }}>Account Created</h1>
            <p className="auth-subheading">Redirecting you to sign in…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Header utilityLink={{ label: 'Sign In', to: '/login' }} />

      <main className="auth-body" id="main-content">
        <div className="auth-card">

          <header className="auth-header">
            <p className="auth-eyebrow">Join Threadora</p>
            <h1 className="auth-heading">Create Account</h1>
            <p className="auth-subheading">
              Unlock member pricing, early access, and free delivery.
            </p>
          </header>

          {error && (
            <div className="auth-global-error" role="alert" aria-live="assertive">
              <AlertIcon />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Create account form">

            {/* Full Name */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={nameId}>Full name</label>
              <div className="auth-input-wrap">
                <input
                  id={nameId}
                  type="text"
                  className={`auth-input${fieldErrors.fullName ? ' is-error' : ''}`}
                  placeholder="Jane Doe"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.fullName}
                  aria-describedby={fieldErrors.fullName ? `${nameId}-error` : undefined}
                />
              </div>
              {fieldErrors.fullName && (
                <span id={`${nameId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.fullName}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={emailId}>Email address</label>
              <div className="auth-input-wrap">
                <input
                  id={emailId}
                  type="email"
                  className={`auth-input${fieldErrors.email ? ' is-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? `${emailId}-error` : undefined}
                />
              </div>
              {fieldErrors.email && (
                <span id={`${emailId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={phoneId}>Phone number</label>
              <div className="auth-input-wrap">
                <input
                  id={phoneId}
                  type="tel"
                  className={`auth-input${fieldErrors.phone ? ' is-error' : ''}`}
                  placeholder="1234567890"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? `${phoneId}-error` : undefined}
                />
              </div>
              {fieldErrors.phone && (
                <span id={`${phoneId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.phone}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={pwId}>Password</label>
              <div className="auth-input-wrap">
                <input
                  id={pwId}
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input has-toggle${fieldErrors.password ? ' is-error' : ''}`}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange('password')}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={`${pwId}-strength${fieldErrors.password ? ` ${pwId}-error` : ''}`}
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

              {form.password && strength && (
                <div className="auth-strength-wrap" id={`${pwId}-strength`}
                  aria-label={`Password strength: ${strength.label}`}>
                  <div className="auth-strength-bars" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n}
                        className={`auth-strength-bar${n <= strength.bars ? ` ${strength.level}` : ''}`}
                      />
                    ))}
                  </div>
                  <span className={`auth-strength-label ${strength.level}`}>{strength.label}</span>
                </div>
              )}

              {fieldErrors.password && (
                <span id={`${pwId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor={cpwId}>Confirm password</label>
              <div className="auth-input-wrap">
                <input
                  id={cpwId}
                  type={showConfirmPw ? 'text' : 'password'}
                  className={`auth-input has-toggle${fieldErrors.confirmPassword ? ' is-error' : ''}`}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? `${cpwId}-error` : undefined}
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {form.confirmPassword && !fieldErrors.confirmPassword
                && form.password === form.confirmPassword && (
                  <span className="auth-success-text" aria-live="polite">
                    <CheckIcon /> Passwords match
                  </span>
                )}
              {fieldErrors.confirmPassword && (
                <span id={`${cpwId}-error`} className="auth-error-text" role="alert">
                  <AlertIcon /> {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms */}
            {/* <div className="auth-field">
              <div className="auth-checkbox-field">
                <input
                  id={termsId}
                  type="checkbox"
                  className="auth-checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setFieldErrors((p) => ({ ...p, terms: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.terms}
                  aria-describedby={fieldErrors.terms ? `${termsId}-error` : undefined}
                />
                <label htmlFor={termsId} className="auth-checkbox-label">
                  I agree to Threadora's{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                </label>
              </div>
              {fieldErrors.terms && (
                <span id={`${termsId}-error`} className="auth-error-text" role="alert"
                  style={{ marginTop: '4px' }}>
                  <AlertIcon /> {fieldErrors.terms}
                </span>
              )}
            </div> */}

            {/* Role selector */}
            <div className="auth-field" role="group" aria-labelledby={`${roleId}-label`}>
              <span id={`${roleId}-label`} className="auth-label">
                I'm joining as&nbsp;
                <span className="auth-label-optional">(optional)</span>
              </span>
              <div className="auth-role-toggle">
                <button
                  type="button"
                  id={`${roleId}-buyer`}
                  className={`auth-role-card${role === 'buyer' ? ' is-active' : ''}`}
                  onClick={() => setRole('buyer')}
                  aria-pressed={role === 'buyer'}
                >
                  <BuyerIcon />
                  <span className="auth-role-card-title">Buyer</span>
                  <span className="auth-role-card-desc">Shop &amp; discover products</span>
                </button>
                <button
                  type="button"
                  id={`${roleId}-seller`}
                  className={`auth-role-card${role === 'seller' ? ' is-active' : ''}`}
                  onClick={() => setRole('seller')}
                  aria-pressed={role === 'seller'}
                >
                  <SellerIcon />
                  <span className="auth-role-card-title">Seller</span>
                  <span className="auth-role-card-desc">List &amp; sell your items</span>
                </button>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              type="submit"
              id="signup-submit-btn"
              className="auth-btn-primary"
              disabled={loading}
              aria-label="Create your account"
            >
              {loading
                ? <><span className="auth-btn-spinner" aria-hidden="true" />Creating account…</>
                : 'Create Account'
              }
            </button>

            <div className="auth-divider" role="separator" aria-hidden="true">or sign up with</div>

            <div className="auth-social-row">
              <button type="button" id="signup-google-btn" className="auth-btn-social" aria-label="Sign up with Google">
                <GoogleIcon /> Google
              </button>
              <button type="button" id="signup-apple-btn" className="auth-btn-social" aria-label="Sign up with Apple">
                <AppleIcon /> Apple
              </button>
            </div>

            <p className="auth-footer-link">
              Already have an account?{' '}
              <Link to="/login" id="signup-signin-link">Sign In</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
