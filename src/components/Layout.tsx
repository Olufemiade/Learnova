import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
export function SiteHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  async function signout() {
    await logout();
    navigate("/");
  }
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          learnova<span className="brand-dot">.</span>
        </Link>
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <a href="/#features" onClick={() => setOpen(false)}>
            Features
          </a>
          <a href="/#how-it-works" onClick={() => setOpen(false)}>
            How it works
          </a>
          <NavLink to="/courses" onClick={() => setOpen(false)}>
            Courses
          </NavLink>
          {user ? (
            <>
              <NavLink
                to={user.role === "Admin" ? "/admin" : "/dashboard"}
                className="nav-dashboard"
              >
                Dashboard
              </NavLink>
              <button className="btn btn-outline btn-small" onClick={signout}>
                <LogOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link
                className="btn btn-primary btn-small"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Get started <span>↗</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Link className="brand footer-brand" to="/">
          <span className="brand-icon">
            <BookOpen size={18} />
          </span>
          learnova.
        </Link>
        <p>Make learning a lifelong advantage.</p>
        <span>
          © {new Date().getFullYear()} Learnova. Built for curious minds.
        </span>
      </div>
    </footer>
  );
}
export function PublicLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </>
  );
}
export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/">
          <span className="brand-icon">
            <GraduationCap size={20} />
          </span>
          learnova.
        </Link>
        <div className="side-label">WORKSPACE</div>
        <NavLink
          to={user?.role === "Admin" ? "/admin" : "/dashboard"}
          end
          className="side-link"
        >
          ▦ <span>Overview</span>
        </NavLink>
        {user?.role === "Admin" ? (
          <>
            <NavLink to="/admin/courses" className="side-link">
              ▤ <span>Manage courses</span>
            </NavLink>
            <NavLink to="/admin/users" className="side-link">
              ♙ <span>Users & enrolments</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/courses" className="side-link">
              ⌕ <span>Explore courses</span>
            </NavLink>
            <NavLink to="/my-learning" className="side-link">
              ▣ <span>My learning</span>
            </NavLink>
          </>
        )}
        <div className="sidebar-bottom">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-mini">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button
            className="icon-button"
            title="Sign out"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <main className="workspace">
        <header className="workspace-top">
          <span>Learning workspace</span>
          <span className="role-pill">{user?.role} account</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
