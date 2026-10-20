import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PublicLayout, AppShell } from "./components/Layout";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { AdminDashboard, AdminCourses, AdminUsers } from "./pages/Admin";
function Protected({
  roles,
  children,
}: {
  roles: ("User" | "Admin")[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return <div className="loading-screen">Loading your learning space…</div>;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role))
    return (
      <Navigate to={user.role === "Admin" ? "/admin" : "/dashboard"} replace />
    );
  return <>{children}</>;
}


export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AppShell />}>
        <Route
          path="/dashboard"
          element={
            <Protected roles={["User"]}>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/my-learning"
          element={
            <Protected roles={["User"]}>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected roles={["Admin"]}>
              <AdminDashboard />
            </Protected>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <Protected roles={["Admin"]}>
              <AdminCourses />
            </Protected>
          }
        />
        <Route
          path="/admin/users"
          element={
            <Protected roles={["Admin"]}>
              <AdminUsers />
            </Protected>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
