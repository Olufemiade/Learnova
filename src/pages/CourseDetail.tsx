import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  GraduationCap,
  LockKeyhole,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Course } from "../types";
export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api<{ course: Course }>(`/courses/${id}`)
      .then((d) => setCourse(d.course))
      .catch((e) => setError(e.message));
  }, [id]);
  async function enroll() {
    if (!user) {
      nav("/login");
      return;
    }
    if (user.role === "Admin") {
      setMessage(
        "Admin accounts manage course content; use a User account to enrol.",
      );
      return;
    }
    setBusy(true);
    try {
      await api(`/enrollments/${id}`, { method: "POST" });
      setMessage("You are enrolled! Your course is available in My learning.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not enrol.");
    } finally {
      setBusy(false);
    }
  }
  if (error)
    return (
      <main className="page-main">
        <div className="container">
          <div className="empty-state">
            <h2>Course unavailable</h2>
            <p>{error}</p>
            <Link to="/courses" className="text-link">
              Back to courses
            </Link>
          </div>
        </div>
      </main>
    );
  if (!course)
    return (
      <main className="page-main">
        <div className="container">Loading course…</div>
      </main>
    );
  return (
    <main className="page-main">
      <div className="container detail-container">
        <Link to="/courses" className="back-link">
          <ArrowLeft size={16} /> All courses
        </Link>
        <div className="detail-grid">
          <section className="detail-main">
            <div className="detail-art">
              <GraduationCap size={52} />
              <span>{course.category}</span>
            </div>
            <div className="course-meta detail-meta">
              <span>{course.level}</span>
              <span>
                <Clock3 size={15} />
                {course.durationHours} hours
              </span>
            </div>
            <h1>{course.title}</h1>
            <p className="detail-description">{course.description}</p>
            <h2>What you'll explore</h2>
            <div className="lesson-list">
              {(course.lessons || []).length ? (
                (course.lessons || []).map((l, i) => (
                  <div className="lesson-row" key={l._id || i}>
                    <span className="lesson-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{l.title}</span>
                    <small>{l.durationMinutes} min</small>
                  </div>
                ))
              ) : (
                <div className="lesson-row">
                  <span className="lesson-index">01</span>
                  <span>Course introduction and learning objectives</span>
                  <small>Start here</small>
                </div>
              )}
            </div>
          </section>
          <aside className="enrol-card">
            <div className="enrol-icon">
              <BookOpen size={24} />
            </div>
            <h3>Ready to get started?</h3>
            <p>
              Enrol to keep this course in your learning dashboard and track
              your progress.
            </p>
            <button
              className="btn btn-primary full-width"
              disabled={busy}
              onClick={enroll}
            >
              {busy ? "Enrolling…" : "Enrol in this course"}
            </button>
            {message && <div className="notice">{message}</div>}
            <div className="secure-note">
              <LockKeyhole size={15} /> Your progress is linked to your account.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
