import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "../LandingPage.css";

export default function AboutPage({ user, setAuthMode }) {
    const navigate = useNavigate();

    const handleAuthRedirect = (mode) => {
        setAuthMode(mode);
        navigate(`/auth?mode=${mode}`);
    };

    return (
        <div className="landing-page">
            {/* Nav Bar */}
            <header className="lp-navbar">
                <div className="lp-navbar-container">
                    <Link to="/" className="lp-logo">
                        <img src={logoImg} alt="Cloudify Logo" className="lp-logo-img" />
                        <span>Cloudify</span>
                    </Link>
                    <nav className="lp-nav-links">
                        <Link to="/" className="lp-nav-link">Home</Link>
                        <Link to="/#features" className="lp-nav-link">Features</Link>
                        <Link to="/#how-it-works" className="lp-nav-link">How It Works</Link>
                    </nav>
                    <div className="lp-nav-actions">
                        {user ? (
                            <>
                                <Link to="/projects" className="lp-nav-link">Dashboard</Link>
                                <span className="lp-body-sm" style={{ color: "var(--lp-mute)", fontFamily: "var(--mono)" }}>
                                    {user.fullname || user.email}
                                </span>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleAuthRedirect("login")} className="lp-btn lp-btn-ghost-sm">
                                    Log In
                                </button>
                                <button onClick={() => handleAuthRedirect("register")} className="lp-btn lp-btn-primary-sm">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="lp-section" style={{ minHeight: "60vh", padding: "var(--spacing-section) var(--spacing-lg)" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <span className="lp-mono-eyebrow">ABOUT CLOUDIFY</span>
                    <h1 className="lp-display-xl" style={{ margin: "16px 0 24px 0", textAlign: "left" }}>
                        Modern Frontend Deployment Infrastructure
                    </h1>
                    
                    <p className="lp-body-lg" style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                        Cloudify is a developer-first platform designed to simplify how frontend applications are built, shipped, and managed. By replacing complex server setups with an automated git-to-deployment pipeline, Cloudify enables developers to launch web apps in seconds.
                    </p>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        Our Architecture
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className="lp-card" style={{ padding: "20px" }}>
                            <h3 className="lp-heading-md">1. Git-Integrated Builder</h3>
                            <p className="lp-body-md" style={{ marginTop: "6px" }}>
                                Directly connects to your GitHub repositories, pulls the codebase, detects configuration properties, and runs optimized production builds inside isolated build workers.
                            </p>
                        </div>
                        <div className="lp-card" style={{ padding: "20px" }}>
                            <h3 className="lp-heading-md">2. Edge Proxy & S3 Storage</h3>
                            <p className="lp-body-md" style={{ marginTop: "6px" }}>
                                Uploads static assets directly to secure object storage. Requests are routed through our high-performance reverse proxy that maps subdomains and custom domains instantly.
                            </p>
                        </div>
                        <div className="lp-card" style={{ padding: "20px" }}>
                            <h3 className="lp-heading-md">3. Real-Time Observability</h3>
                            <p className="lp-body-md" style={{ marginTop: "6px" }}>
                                Connects to build logs dynamically, streaming compile progress and edge server access logs right to your developer dashboard.
                            </p>
                        </div>
                    </div>

                    <h2 className="lp-heading-lg" style={{ margin: "40px 0 16px 0", textAlign: "left" }}>
                        Open Source & Transparent
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6" }}>
                        We believe in open standards and transparent infrastructure. The entire Cloudify stack—including the API server, the S3 reverse proxy router, the container builder script, and the Geist-themed developer dashboard—is open source and accessible on GitHub.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="lp-footer">
                <div className="lp-footer-container">
                    <div className="lp-footer-grid">
                        <div className="lp-footer-brand">
                            <Link to="/" className="lp-logo">
                                <img src={logoImg} alt="Cloudify Logo" className="lp-logo-img" />
                                <span>Cloudify</span>
                            </Link>
                            <p className="lp-body-sm" style={{ marginTop: "12px" }}>
                                Deploy your frontend repositories in minutes.
                            </p>
                        </div>
                        <div className="lp-footer-col">
                            <h4>Product</h4>
                            <ul>
                                <li><Link to="/#features">Features</Link></li>
                                <li><Link to="/#how-it-works">How It Works</Link></li>
                                <li><Link to="/#why-us">Comparison</Link></li>
                            </ul>
                        </div>
                        <div className="lp-footer-col">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="https://github.com/avishek0769/Cloudify" target="_blank" rel="noreferrer">GitHub</a></li>
                            </ul>
                        </div>
                        <div className="lp-footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="lp-footer-bottom">
                        <span className="lp-body-sm">
                            © {new Date().getFullYear()} Cloudify. All rights reserved.
                        </span>
                        <span className="lp-body-sm" style={{ display: "flex", gap: "16px" }}>
                            <Link to="/terms" style={{ color: "var(--lp-mute)", textDecoration: "none" }}>Terms</Link>
                            <Link to="/privacy" style={{ color: "var(--lp-mute)", textDecoration: "none" }}>Privacy</Link>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
