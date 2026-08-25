import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden fade-in-el">
      {/* Background glow layers */}
      <div className="bg-glow-container">
        <div className="glow-circle glow-circle-1"></div>
        <div className="glow-circle glow-circle-2"></div>
      </div>

      {/* Basic Landing Header */}
      <header className="glass-navbar py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <span className="fs-4 fw-bold gradient-text-neon" style={{ fontFamily: "var(--font-heading)" }}>
            PortalFlow
          </span>
        </div>
        <div className="d-flex gap-3">
          <Link to="/login" className="btn-premium-secondary py-2 px-3 fs-6">
            Sign In
          </Link>
          <Link to="/register" className="btn-premium py-2 px-3 fs-6">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container my-auto py-5 flex-grow-1 d-flex flex-column justify-content-center">
        <div className="row align-items-center justify-content-center text-center">
          <div className="col-lg-8">
            <h1 className="display-4 fw-extrabold mb-4" style={{ fontFamily: "var(--font-heading)", lineHeight: "1.1" }}>
              Modern Management, <span className="gradient-text-neon">Simplified.</span>
            </h1>
            <p className="lead text-secondary mb-5" style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
              Streamline employee tracking and student records within a secure, beautiful, and ultra-fast workspace. Powered by Vite & React.
            </p>
            
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn-premium py-3 px-4 fs-5">
                Register Free
              </Link>
              <Link to="/login" className="btn-premium-secondary py-3 px-4 fs-5">
                Admin Console
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row mt-5 pt-5 g-4 justify-content-center">
          <div className="col-md-4">
            <div className="glass-card p-4 h-100">
              <div className="fs-3 mb-3 text-primary">📊</div>
              <h3 className="h5 mb-2">Employee Metrics</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                Keep track of jobs, contact points, status logs, and update credentials instantly.
              </p>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="glass-card p-4 h-100">
              <div className="fs-3 mb-3 text-secondary">🎓</div>
              <h3 className="h5 mb-2">Student Registry</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                Fully integrated index of active student rosters, dynamic age filters, and database searches.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card p-4 h-100">
              <div className="fs-3 mb-3 text-warning">⚡</div>
              <h3 className="h5 mb-2">Real-Time Sync</h3>
              <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
                Underpinned by custom axios interceptors and secure authorization protocols.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-muted" style={{ borderTop: "1px solid var(--border-color)", fontSize: "0.9rem" }}>
        © {new Date().getFullYear()} PortalFlow Corp. Built with Vite and React 19.
      </footer>
    </div>
  );
};

export default Home;
