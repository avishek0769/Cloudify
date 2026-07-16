import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import "../LandingPage.css";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/react";

export default function PrivacyPage() {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();

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
                        {isSignedIn ? (
                            <>
                                <Link to="/projects" className="lp-nav-link">Dashboard</Link>
                                <UserButton afterSignOutUrl="/" />
                            </>
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <button className="lp-btn lp-btn-ghost-sm">Log In</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="lp-btn lp-btn-primary-sm">Sign Up</button>
                                </SignUpButton>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="lp-section" style={{ minHeight: "60vh", padding: "var(--spacing-section) var(--spacing-lg)" }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <span className="lp-mono-eyebrow">LEGAL STATEMENTS</span>
                    <h1 className="lp-display-xl" style={{ margin: "16px 0 24px 0", textAlign: "left" }}>
                        Privacy Policy
                    </h1>
                    
                    <p className="lp-body-md" style={{ color: "var(--lp-mute)", marginBottom: "24px" }}>
                        Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <p className="lp-body-lg" style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                        At Cloudify, we prioritize your security and privacy. This Privacy Policy documents the types of data we collect, how it is processed, and the measures we take to protect your repositories and account information.
                    </p>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        1. Data We Collect
                    </h2>
                    <ul className="lp-body-md" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", lineHeight: "1.6" }}>
                        <li><strong>Account Profile Data:</strong> When registering, we store your name, email address, and hashed authentication credentials.</li>
                        <li><strong>GitHub Repository Metadata:</strong> We store references to public github URLs that you explicitly choose to deploy on our platform.</li>
                        <li><strong>Build Logs:</strong> Output logs generated during your project builds are stored temporarily on our servers to help you debug errors.</li>
                    </ul>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        2. How We Use Your Data
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6", marginBottom: "16px" }}>
                        Your information is used solely to provide frontend hosting services:
                    </p>
                    <ul className="lp-body-md" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", lineHeight: "1.6" }}>
                        <li>To queue, build, and deploy your code repositories.</li>
                        <li>To route web traffic from your custom subdomains or domains to our edge S3 storage buckets.</li>
                        <li>To verify DNS ownership (using standard CNAME queries) when configuring custom domains.</li>
                    </ul>

                    <h2 className="lp-heading-lg" style={{ margin: "32px 0 16px 0", textAlign: "left" }}>
                        3. Third-Party Integrations
                    </h2>
                    <p className="lp-body-md" style={{ lineHeight: "1.6" }}>
                        Cloudify does not sell, trade, or rent your personal data to third parties. We interact with GitHub API services to access your public code and deploy it according to your dashboard settings.
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
