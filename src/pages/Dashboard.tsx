import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Clock3,
  Compass,
  Sparkles,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Enrollment } from "../types";
export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api<{ enrollments: Enrollment[] }>("/enrollments/me")
      .then((d) => setEnrollments(d.enrollments))
      .catch((e) => setError(e.message));
  }, []);
  const completed = enrollments.filter((e) => e.progress === 100).length;
  const average = enrollments.length
    ? Math.round(
        enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length,
      )
    : 0;
  return (
    <div className="dashboard-content">
      <div className="welcome-row">
        <div>
          <div className="eyebrow eyebrow-light">YOUR LEARNING SPACE</div>
          <h1>
            Keep going, {user?.name.split(" ")[0]}
            <span>.</span>
          </h1>
          <p>Every lesson is a step towards the person you're becoming.</p>
        </div>
        <Link className="btn btn-primary" to="/courses">
          <Compass size={17} /> Explore courses
        </Link>
      </div>
      <div className="stats-grid">
        <Stat
          icon={<BookOpen />}
          label="Enrolled courses"
          value={enrollments.length}
        />
        <Stat
          icon={<ChartNoAxesCombined />}
          label="Average progress"
          value={`${average}%`}
        />
        <Stat icon={<Sparkles />} label="Courses completed" value={completed} />
      </div>
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h2>My learning</h2>
            <p>Pick up where you left off.</p>
          </div>
          <Link to="/courses" className="text-link">
            Browse library <ArrowRight size={16} />
          </Link>
        </div>
        {error ? (
          <div className="notice">{error}</div>
        ) : enrollments.length === 0 ? (
          <div className="empty-state compact">
            <div className="empty-icon">
              <BookOpen />
            </div>
            <h3>Your learning journey starts here</h3>
            <p>
              Explore the course library and enrol in something that interests
              you.
            </p>
            <Link className="btn btn-primary" to="/courses">
              Explore courses <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="my-course-list">
            {enrollments.map((e) => (
              <article className="my-course" key={e._id}>
                <div className="my-course-icon">
                  <BookOpen size={23} />
                </div>
                <div className="my-course-info">
                  <span className="course-category-text">
                    {e.course?.category || "Course"}
                  </span>
                  <h3>{e.course?.title || "Course"}</h3>
                  <div className="progress-track">
                    <i style={{ width: `${e.progress}%` }} />
                  </div>
                  <small>{e.progress}% complete</small>
                </div>
                <Link
                  to={`/courses/${e.course?._id}`}
                  className="circle-arrow"
                  aria-label="Open course"
                >
                  <ArrowRight size={17} />
                </Link>
                <div className="progress-control">
                  <label htmlFor={`progress-${e._id}`}>Update progress</label>
                  <select
                    id={`progress-${e._id}`}
                    value={e.progress}
                    onChange={async (ev) => {
                      const progress = Number(ev.target.value);
                      try {
                        await api(`/enrollments/${e._id}/progress`, {
                          method: "PATCH",
                          body: JSON.stringify({ progress }),
                        });
                        setEnrollments((prev) =>
                          prev.map((x) =>
                            x._id === e._id ? { ...x, progress } : x,
                          ),
                        );
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Could not update progress.",
                        );
                      }
                    }}
                  >
                    <option value={0}>Not started</option>
                    <option value={25}>25%</option>
                    <option value={50}>50%</option>
                    <option value={75}>75%</option>
                    <option value={100}>Completed</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <div className="learning-tip">
        <div className="tip-icon">
          <Clock3 />
        </div>
        <div>
          <strong>A little progress adds up.</strong>
          <p>
            Set aside a short, regular learning session and keep your momentum
            going.
          </p>
        </div>
      </div>
    </div>
  );
}
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
