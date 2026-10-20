import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock3, Search } from "lucide-react";
import { api } from "../services/api";
import type { Course } from "../types";
export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api<{ courses: Course[] }>("/courses")
      .then((d) => setCourses(d.courses))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const filtered = courses.filter((c) =>
    `${c.title} ${c.description} ${c.category}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <main className="page-main">
      <div className="container">
        <div className="page-heading">
          <div className="eyebrow eyebrow-light">THE COURSE LIBRARY</div>
          <h1>
            Find something worth <span>learning.</span>
          </h1>
          <p>
            Explore published courses, find your next skill, and make progress
            one lesson at a time.
          </p>
        </div>
        <div className="course-search">
          <Search size={19} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses, topics, or categories…"
          />
        </div>
        {loading ? (
          <p>Loading courses…</p>
        ) : error ? (
          <div className="notice">
            {error}. Check that the API server is running.
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={34} />
            <h3>
              {courses.length
                ? "No matching courses"
                : "Courses are on the way"}
            </h3>
            <p>
              {courses.length
                ? "Try another search term."
                : "Published courses will appear here when an administrator adds them."}
            </p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((c) => (
              <article className="course-card" key={c._id}>
                <div className="course-art">
                  <span className="course-art-icon">
                    <BookOpen size={28} />
                  </span>
                  <span className="course-category">{c.category}</span>
                </div>
                <div className="course-body">
                  <div className="course-meta">
                    <span>{c.level}</span>
                    <span>
                      <Clock3 size={14} /> {c.durationHours} hours
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <Link to={`/courses/${c._id}`} className="course-link">
                    View course <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
