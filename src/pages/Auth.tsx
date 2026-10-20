import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login(email, password);
      nav(user.role === "Admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthFrame
      title="Welcome back."
      subtitle="Sign in and pick up where your learning left off."
    >
      <form onSubmit={submit} className="auth-form">
        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button
          className="btn btn-primary btn-large full-width"
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in securely"}
        </button>
      </form>
      <p className="auth-switch">
        New to Learnova? <Link to="/register">Create an account</Link>
      </p>
    </AuthFrame>
  );
}
export function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(name, email, password);
      nav("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create account.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthFrame
      title="Start with curiosity."
      subtitle="Create your learner account and take the first step."
    >
      <form onSubmit={submit} className="auth-form">
        <label>
          Full name
          <input
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Email address
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={72}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 10 characters"
          />
          <small>Use at least 10 characters.</small>
        </label>
        {error && <div className="form-error">{error}</div>}
        <button
          className="btn btn-primary btn-large full-width"
          disabled={busy}
        >
          {busy ? "Creating account…" : "Create learner account"}
        </button>
        <p className="form-note">
          <ShieldCheck size={15} /> Public sign-up creates a User account. Admin
          accounts are provisioned separately.
        </p>
      </form>
      <p className="auth-switch">
        Already registered? <Link to="/login">Sign in</Link>
      </p>
    </AuthFrame>
  );
}
function AuthFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <Link to="/" className="auth-back">
        <ArrowLeft size={16} /> Back to Learnova
      </Link>
      <section className="auth-card">
        <Link className="brand auth-brand" to="/">
          <span className="brand-icon">
            <GraduationCap size={20} />
          </span>
          learnova.
        </Link>
        <div className="eyebrow eyebrow-light">YOUR LEARNING SPACE</div>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </section>
      <p className="auth-foot">Secure access. Your own learning journey.</p>
    </main>
  );
}
