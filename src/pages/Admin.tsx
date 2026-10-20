import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Plus,
  Users,
  GraduationCap,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "../services/api";
import type { Course, User, Enrollment } from "../types";
type Summary = {
  users: number;
  courses: number;
  publishedCourses: number;
  enrollments: number;
  completed: number;
};
export function AdminDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api<{ summary: Summary }>("/admin/summary"),
      api<{ courses: Course[] }>("/courses/admin/all"),
    ])
      .then(([s, c]) => {
        setSummary(s.summary);
        setCourses(c.courses.slice(0, 5));
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="dashboard-content">
      <div className="welcome-row">
        <div>
          <div className="eyebrow eyebrow-light">ADMINISTRATION</div>
          <h1>
            Platform overview<span>.</span>
          </h1>
          <p>
            Manage the course library and keep the learning experience
            organised.
          </p>
        </div>
        <Link className="btn btn-primary" to="/admin/courses">
          <Plus size={17} /> Manage courses
        </Link>
      </div>
      {error && <div className="notice">{error}</div>}
      <div className="stats-grid">
        <Stat
          icon={<Users />}
          label="Learner accounts"
          value={summary?.users ?? "—"}
        />
        <Stat
          icon={<BookOpen />}
          label="All courses"
          value={summary?.courses ?? "—"}
        />
        <Stat
          icon={<GraduationCap />}
          label="Enrolments"
          value={summary?.enrollments ?? "—"}
        />
        <Stat
          icon={<CheckCircle2 />}
          label="Completed courses"
          value={summary?.completed ?? "—"}
        />
      </div>
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h2>Recently managed courses</h2>
            <p>Drafts and published courses.</p>
          </div>
          <Link to="/admin/courses" className="text-link">
            All courses <ArrowRight size={16} />
          </Link>
        </div>
        <div className="admin-course-table">
          <div className="table-head">
            <span>COURSE</span>
            <span>CATEGORY</span>
            <span>STATUS</span>
          </div>
          {courses.map((c) => (
            <div className="table-row" key={c._id}>
              <div className="table-course">
                <span className="table-icon">
                  <BookOpen size={17} />
                </span>
                <strong>{c.title}</strong>
              </div>
              <span>{c.category}</span>
              <span
                className={c.published ? "status-published" : "status-draft"}
              >
                {c.published ? "Published" : "Draft"}
              </span>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="table-empty">
              No courses yet. Create your first course.
            </div>
          )}
        </div>
      </section>
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
const emptyForm = {
  title: "",
  description: "",
  category: "Technology",
  level: "Beginner" as Course["level"],
  durationHours: 1,
  thumbnailUrl: "",
  published: false,
  lessons: "Introduction|10",
};
export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const d = await api<{ courses: Course[] }>("/courses/admin/all");
    setCourses(d.courses);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  function edit(c: Course) {
    setEditing(c._id);
    setForm({
      title: c.title,
      description: c.description,
      category: c.category,
      level: c.level,
      durationHours: c.durationHours,
      thumbnailUrl: c.thumbnailUrl || "",
      published: c.published,
      lessons: (c.lessons || [])
        .map((l) => `${l.title}|${l.durationMinutes}`)
        .join("\n"),
    });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() {
    setEditing(null);
    setForm(emptyForm);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const lessons = form.lessons
      .split("\n")
      .map((x) => {
        const [title, duration = "10"] = x.split("|");
        return { title: title.trim(), durationMinutes: Number(duration) };
      })
      .filter((x) => x.title);
    const payload = {
      ...form,
      durationHours: Number(form.durationHours),
      lessons,
    };
    try {
      if (editing)
        await api(`/courses/${editing}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      else
        await api("/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      await load();
      setNotice(editing ? "Course updated." : "Course created.");
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save course.");
    } finally {
      setBusy(false);
    }
  }
  async function toggle(c: Course) {
    try {
      await api(`/courses/${c._id}`, {
        method: "PATCH",
        body: JSON.stringify({ ...c, published: !c.published }),
      });
      await load();
      setNotice(`Course ${c.published ? "unpublished" : "published"}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update course.");
    }
  }
  async function remove(c: Course) {
    if (!window.confirm(`Delete “${c.title}”? This cannot be undone.`)) return;
    try {
      await api(`/courses/${c._id}`, { method: "DELETE" });
      await load();
      setNotice("Course deleted.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete course.");
    }
  }
  return (
    <div className="dashboard-content">
      <div className="welcome-row">
        <div>
          <div className="eyebrow eyebrow-light">CONTENT MANAGEMENT</div>
          <h1>
            Course library<span>.</span>
          </h1>
          <p>Create, update, and publish learning content for users.</p>
        </div>
      </div>
      <section className="admin-form-card">
        <div className="section-title-row">
          <div>
            <h2>{editing ? "Edit course" : "Create a course"}</h2>
            <p>Courses are hidden from users until published.</p>
          </div>
          {editing && (
            <button className="btn btn-outline" onClick={reset}>
              Cancel edit
            </button>
          )}
        </div>
        <form className="admin-course-form" onSubmit={submit}>
          <label>
            Course title
            <input
              required
              minLength={3}
              maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Introduction to web development"
            />
          </label>
          <label>
            Category
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
          <label className="span-two">
            Description
            <textarea
              required
              minLength={20}
              maxLength={5000}
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Explain what learners will gain from this course…"
            />
          </label>
          <label>
            Level
            <select
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: e.target.value as Course["level"] })
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label>
            Duration (hours)
            <input
              type="number"
              min={1}
              max={500}
              required
              value={form.durationHours}
              onChange={(e) =>
                setForm({ ...form, durationHours: Number(e.target.value) })
              }
            />
          </label>
          <label className="span-two">
            Lessons{" "}
            <small>One per line, in the format: Lesson title|minutes</small>
            <textarea
              rows={4}
              value={form.lessons}
              onChange={(e) => setForm({ ...form, lessons: e.target.value })}
              placeholder={"Getting started|10\nCore concepts|20"}
            />
          </label>
          <label className="span-two">
            Thumbnail image URL (optional)
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) =>
                setForm({ ...form, thumbnailUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <label className="checkbox-label span-two">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
            />{" "}
            Publish immediately (visible in public catalogue)
          </label>
          <div className="span-two form-actions">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Create course"}
            </button>
          </div>
        </form>
        {error && <div className="form-error">{error}</div>}
        {notice && <div className="notice success-notice">{notice}</div>}
      </section>
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h2>
              All courses <span className="count-pill">{courses.length}</span>
            </h2>
            <p>Manage visibility and course details.</p>
          </div>
        </div>
        <div className="admin-course-table">
          <div className="table-head">
            <span>COURSE</span>
            <span>CATEGORY</span>
            <span>STATUS / ACTIONS</span>
          </div>
          {courses.map((c) => (
            <div className="table-row admin-action-row" key={c._id}>
              <div className="table-course">
                <span className="table-icon">
                  <BookOpen size={17} />
                </span>
                <strong>{c.title}</strong>
              </div>
              <span>{c.category}</span>
              <div className="row-actions">
                <span
                  className={c.published ? "status-published" : "status-draft"}
                >
                  {c.published ? "Published" : "Draft"}
                </span>
                <button
                  className="icon-button"
                  title={c.published ? "Unpublish" : "Publish"}
                  onClick={() => toggle(c)}
                >
                  {c.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  className="icon-button"
                  title="Edit"
                  onClick={() => edit(c)}
                >
                  ✎
                </button>
                <button
                  className="icon-button danger-icon"
                  title="Delete"
                  onClick={() => remove(c)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="table-empty">
              No courses yet. Use the form above to create one.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      api<{ users: User[] }>("/admin/users"),
      api<{ enrollments: Enrollment[] }>("/admin/enrollments"),
    ])
      .then(([u, e]) => {
        setUsers(u.users);
        setEnrollments(e.enrollments as unknown as Enrollment[]);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="dashboard-content">
      <div className="welcome-row">
        <div>
          <div className="eyebrow eyebrow-light">PLATFORM OVERSIGHT</div>
          <h1>
            Users & enrolments<span>.</span>
          </h1>
          <p>Review learner accounts and course participation.</p>
        </div>
      </div>
      {error && <div className="notice">{error}</div>}
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h2>Registered accounts</h2>
            <p>{users.length} accounts in the platform.</p>
          </div>
        </div>
        <div className="admin-course-table">
          <div className="table-head">
            <span>USER</span>
            <span>ROLE</span>
            <span>JOINED</span>
          </div>
          {users.map((u) => (
            <div className="table-row" key={u.id}>
              <div className="table-course">
                <span className="avatar table-avatar">{u.name[0]}</span>
                <div>
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </div>
              </div>
              <span
                className={
                  u.role === "Admin" ? "status-published" : "status-draft"
                }
              >
                {u.role}
              </span>
              <span>
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <h2>Recent enrolments</h2>
            <p>Enrolment and progress overview.</p>
          </div>
        </div>
        <div className="admin-course-table">
          <div className="table-head">
            <span>LEARNER</span>
            <span>COURSE</span>
            <span>PROGRESS</span>
          </div>
          {enrollments.map((e: any) => (
            <div className="table-row" key={e._id}>
              <div className="table-course">
                <strong>{e.user?.name || "Learner"}</strong>
                <small>{e.user?.email || ""}</small>
              </div>
              <span>{e.course?.title || "Course"}</span>
              <span>{e.progress}%</span>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="table-empty">No enrolments yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}
