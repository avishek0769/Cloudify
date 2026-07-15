import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "../LandingPage.css";

export default function TermsPage({ user, setAuthMode }) {
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
                    <span className="lp-mono-eyebrow">TERMS & CONDITIONS</span>
                    <h1 className="lp-display-xl" style={{ margin: "16px 0 24px 0", textAlign: "left" }}>
                        Terms of Service
                    </h1>
                    
                    <p className="lp-body-md" style={{ color: "var(--lp-mute)", marginBottom: "24px" }}>
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <p className="lp-body-lg" style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                        Welcome to Cloudify. By accessing or using our developer tools, dashboards, and automated frontend hosting networks, you agree to comply with and be bound by the following Terms of Service.
                    </p>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        1. Services Provided
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6" }}>
                        Cloudify provides automated repository pulling, static build executions, file storage upload, and HTTP routing mapping services. We reserve the right to suspend accounts deploying malicious payloads, malware, or phishing applications.
                    </p>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        2. Custom Domains & DNS
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6" }}>
                        When you configure a custom domain, you are responsible for maintaining valid CNAME records with your DNS provider pointing to your Cloudify subdomain. Cloudify is not responsible for routing outages resulting from misconfigured DNS entries.
                    </p>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        3. Limitation of Liability
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6" }}>
                        Cloudify is provided "as is" without warranties of any kind. Under no circumstances shall Cloudify or its maintainers be liable for database disruptions, failed builds, deployment downtime, or data loss.
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
