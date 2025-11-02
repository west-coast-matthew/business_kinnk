'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { analytics } from '@/lib/analytics/tracker';
import '@/styles/pages/account.scss';

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, login, signup, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        analytics.signup({
          method: 'email',
          source: 'login',
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(
        signupForm.email,
        signupForm.password,
        signupForm.firstName,
        signupForm.lastName
      );

      if (result.success) {
        analytics.signup({
          method: 'email',
          source: 'signup',
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isAuthenticated && user) {
    return (
      <div className="account-page">
        <div className="container">
          <div className="account-header">
            <h1>My Account</h1>
            <p>Welcome, {user.firstName}!</p>
          </div>

          <div className="account-content">
            <section className="account-section">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Name</span>
                  <span className="value">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Email</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Member Since</span>
                  <span className="value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </section>

            <section className="account-section">
              <h2>Quick Links</h2>
              <div className="quick-links">
                <a href="/account/orders" className="link-btn">
                  View Orders
                </a>
                <a href="/account/settings" className="link-btn">
                  Settings
                </a>
                <a href="/account/wishlist" className="link-btn">
                  My Wishlist
                </a>
              </div>
            </section>

            <section className="account-section">
              <h2>Account Actions</h2>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="auth-form-wrapper">
          {isLoginMode ? (
            <div className="auth-form">
              <h1>Login</h1>
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••���•••••"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="form-divider">OR</div>

              <button
                className="btn btn-secondary btn-full"
                onClick={() => setIsLoginMode(false)}
              >
                Create New Account
              </button>

              <p className="form-footer">
                <a href="#forgot-password">Forgot your password?</a>
              </p>
            </div>
          ) : (
            <div className="auth-form">
              <h1>Create Account</h1>
              <form onSubmit={handleSignup}>
                <div className="form-row">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={signupForm.firstName}
                      onChange={handleSignupChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={signupForm.lastName}
                      onChange={handleSignupChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="form-divider">OR</div>

              <button
                className="btn btn-secondary btn-full"
                onClick={() => setIsLoginMode(true)}
              >
                Already have an account? Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
