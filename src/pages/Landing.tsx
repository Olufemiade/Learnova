import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  GraduationCap,
  Play,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
const features = [
  {
    icon: BookOpen,
    title: "Learning, organised",
    text: "Find thoughtfully organised courses by category and skill level, with clear lesson outlines and learning goals.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Progress you can see",
    text: "Keep track of your enrolled courses and update completion progress from your personal learning dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Access with purpose",
    text: "User and Admin roles separate learner experiences from course-management tools, with permissions checked by the server.",
  },
];
const steps = [
  [
    "01",
    "Discover",
    "Browse the course catalogue and find a subject that fits your goals.",
  ],
  [
    "02",
    "Enrol",
    "Join a published course and keep it in your personal learning space.",
  ],
  [
    "03",
    "Make progress",
    "Return to your dashboard and update your progress as you work through lessons.",
  ],
];
export default function Landing() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE
              </div>
              <h1>
                Curiosity is a skill.
                <br />
                <span>Keep growing.</span>
              </h1>
              <p className="hero-lede">
                A clearer way to learn new skills, explore ideas, and keep your
                progress moving. Meet Learnova, your home for learning that fits
                your ambition.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-large" to="/courses">
                  Explore courses <ArrowRight size={18} />
                </Link>
                <Link className="btn btn-light btn-large" to="/register">
                  Create free account
                </Link>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack">
                  <span>J</span>
                  <span>A</span>
                  <span>M</span>
                  <span>+</span>
                </div>
                <div>
                  <strong>Built around your goals</strong>
                  <small>Learn at your own pace, one lesson at a time.</small>
                </div>
              </div>
            </div>
            <div className="hero-art">
              <div className="art-orbit orbit-a" />
              <div className="art-orbit orbit-b" />
              <div className="learning-card card-main">
                <div className="card-top">
                  <div className="course-icon purple">
                    <BrainCircuit size={24} />
                  </div>
                  <span className="live-label">
                    <i /> LEARNING PATH
                  </span>
                </div>
                <p className="card-kicker">YOUR WEEKLY FOCUS</p>
                <h3>
                  Build skills that
                  <br />
                  move you forward.
                </h3>
                <div className="mini-progress">
                  <div>
                    <span>Learning momentum</span>
                    <strong>72%</strong>
                  </div>
                  <div className="progress-track">
                    <i style={{ width: "72%" }} />
                  </div>
                </div>
                <div className="card-bottom">
                  <div className="tiny-icon">
                    <Video size={16} />
                  </div>
                  <div>
                    <strong>Next up: Lesson 04</strong>
                    <small>Designing better habits · 12 min</small>
                  </div>
                  <span className="play-button">
                    <Play size={14} fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="floating-note note-top">
                <span className="note-icon green">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <strong>Progress saved</strong>
                  <small>You're building a habit.</small>
                </div>
              </div>
              <div className="floating-note note-bottom">
                <span className="note-icon yellow">
                  <GraduationCap size={19} />
                </span>
                <div>
                  <strong>One step at a time</strong>
                  <small>Small lessons. Real momentum.</small>
                </div>
              </div>
              <div className="art-decoration decoration-one">✳</div>
              <div className="art-decoration decoration-two">✦</div>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>DESIGNED FOR SELF-DIRECTED LEARNERS</span>
            <div>
              <span>
                <BookOpen size={16} /> Explore
              </span>
              <span>
                <ChartNoAxesCombined size={16} /> Track progress
              </span>
              <span>
                <ShieldCheck size={16} /> Learn securely
              </span>
            </div>
          </div>
        </section>
        <section className="section section-white" id="features">
          <div className="container">
            <div className="section-heading">
              <div className="eyebrow eyebrow-light">A BETTER WAY TO LEARN</div>
              <h2>
                Everything you need to
                <br />
                keep moving <span>forward.</span>
              </h2>
              <p>
                Learning should feel clear and achievable. Learnova brings the
                essentials together in one focused space.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((f, i) => (
                <article className="feature-card" key={f.title}>
                  <div className={"feature-icon feature-" + i}>
                    <f.icon size={23} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <span className="feature-number">0{i + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section section-soft" id="how-it-works">
          <div className="container process-grid">
            <div>
              <div className="eyebrow eyebrow-light">SIMPLE BY DESIGN</div>
              <h2>
                Your goals.
                <br />
                <span>Your pace.</span>
              </h2>
              <p className="section-description">
                From first discovery to visible progress, the learning journey
                is designed to help you focus on what comes next.
              </p>
              <Link to="/courses" className="text-link">
                Find your first course <ArrowRight size={17} />
              </Link>
            </div>
            <div className="steps-list">
              {steps.map((s) => (
                <div className="step" key={s[0]}>
                  <div className="step-number">{s[0]}</div>
                  <div>
                    <h3>{s[1]}</h3>
                    <p>{s[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section security-section">
          <div className="container security-panel">
            <div className="security-visual">
              <div className="shield-circle">
                <ShieldCheck size={48} />
              </div>
              <span className="security-orbit orbit-one" />
              <span className="security-orbit orbit-two" />
            </div>
            <div className="security-copy">
              <div className="eyebrow">ACCESS THAT MAKES SENSE</div>
              <h2>
                Personal learning.
                <br />
                <span>Responsible control.</span>
              </h2>
              <p>
                Learnova uses two clearly defined roles. Users access courses
                and their own learning records. Administrators manage course
                content and oversee platform activity. The backend checks
                permissions on protected requests, so security does not depend
                only on what the interface displays.
              </p>
              <ul>
                <li>
                  <CheckCircle2 size={17} /> Secure sign-in with hashed
                  passwords
                </li>
                <li>
                  <CheckCircle2 size={17} /> Role checks on protected API routes
                </li>
                <li>
                  <CheckCircle2 size={17} /> Separate learner and admin
                  workspaces
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="cta-section">
          <div className="container cta-panel">
            <div className="cta-spark">
              <GraduationCap size={30} />
            </div>
            <h2>
              Make room for what
              <br />
              you'll learn next.
            </h2>
            <p>Start exploring courses and build your own learning momentum.</p>
            <Link className="btn btn-dark btn-large" to="/register">
              Start learning <ArrowRight size={18} />
            </Link>
            <span className="cta-note">
              Create an account in a few steps. Keep learning at your pace.
            </span>
          </div>
        </section>
      </main>
    </>
  );
}
