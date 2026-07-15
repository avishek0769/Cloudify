import { Link, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";
import reactIcon from "../assets/react-icon.webp";
// import nextjsIcon from "../assets/nextjs-icon.png";
import svelteIcon from "../assets/svelte-icon.webp";
import vueIcon from "../assets/vue-icon.png";
import viteIcon from "../assets/vite-icon.webp";
import "../LandingPage.css";

export default function LandingPage({ user, setAuthMode }) {
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
                        <a href="#features" className="lp-nav-link">Features</a>
                        <a href="#how-it-works" className="lp-nav-link">How It Works</a>
                        <a href="#why-us" className="lp-nav-link">Why Us</a>
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

            {/* Hero Section */}
            <section className="lp-hero">
                <div className="lp-hero-gradient"></div>
                <div className="lp-hero-content">
                    <span className="lp-mono-eyebrow" style={{ display: "inline-block", marginBottom: "16px" }}>
                        Frontend Hosting Platform
                    </span>
                    <h1 className="lp-display-xl">
                        Deploy frontend apps with a <br />
                        <span style={{ 
                            background: "linear-gradient(90deg, var(--lp-link) 0%, var(--lp-grad-preview-start) 50%, var(--lp-grad-preview-end) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "700"
                        }}>
                            few clicks
                        </span>
                    </h1>
                    <p className="lp-hero-tagline">
                        From GitHub to a live website in minutes. No payments. No deployment limits. No complicated setup. Just connect your repository and click 'deploy'.
                    </p>
                    
                    <div className="lp-hero-ctas">
                        {user ? (
                            <Link to="/projects" className="lp-btn lp-btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <button onClick={() => handleAuthRedirect("register")} className="lp-btn lp-btn-primary">
                                Deploy Now
                            </button>
                        )}
                        <a href="https://github.com/avishek0769/Cloudify" target="_blank" rel="noreferrer" className="lp-btn lp-btn-secondary">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginRight: "8px" }}>
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                            View GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Logo Strip */}
            <div className="lp-logo-strip">
                <div className="lp-logo-strip-container">
                    <div className="lp-logo-strip-label">Compatible with modern frontend frameworks</div>
                    <div className="lp-logos">
                        <div className="lp-logo-item">
                            <img src={reactIcon} alt="React" />
                            <span>React</span>
                        </div>
                        {/* <div className="lp-logo-item">
                            <img src={nextjsIcon} alt="Next.js" />
                            <span>Next.js</span>
                        </div> */}
                        <div className="lp-logo-item">
                            <img src={vueIcon} alt="Vue" />
                            <span>Vue</span>
                        </div>
                        <div className="lp-logo-item">
                            <img src={viteIcon} alt="Vite" />
                            <span>Vite</span>
                        </div>
                        <div className="lp-logo-item">
                            <img src={svelteIcon} alt="Vite" />
                            <span>Svelte</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid Section */}
            <section id="features" className="lp-section">
                <div className="lp-section-header">
                    <span className="lp-mono-eyebrow">Production-Grade Capabilities</span>
                    <h2 className="lp-heading-lg">Features engineered for creators</h2>
                    <p className="lp-body-lg">Deploy static web apps, single page applications, or static framework exports instantly with full observability.</p>
                </div>

                <div className="lp-feature-grid">
                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">GitHub Integration</h3>
                        <p className="lp-body-md">Connect your repository in seconds. We monitor commits on main or production branches and deploy code automatically on every git push.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">Instant Frontend Hosting</h3>
                        <p className="lp-body-md">Frontends launch in under 5 minutes on our fast global proxy network, providing immediate secure routing.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">Framework Auto-detection</h3>
                        <p className="lp-body-md">Zero configuration required. Auto-detects React, Next.js static, Vue, Vite, Astro, Svelte, and static HTML configurations.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.997 8.997 0 0 0 7.843-4.582M12 21a8.997 8.997 0 0 1-7.843-4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">Custom Domains</h3>
                        <p className="lp-body-md">Generate default secure subdomains instantly or connect custom DNS records to point your personal domains.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">SSL & Global Delivery</h3>
                        <p className="lp-body-md">Reverse-proxy gateways distribute frontend static assets globally with built-in automatic free SSL certificates.</p>
                    </div>

                    <div className="lp-card">
                        <div className="lp-card-icon">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                        </div>
                        <h3 className="lp-heading-md">Free Forever</h3>
                        <p className="lp-body-md">Enjoy unlimited deployments without a credit card. No pricing walls or limits for hobby developers.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="lp-section" style={{ borderTop: "1px solid var(--lp-hairline)" }}>
                <div className="lp-section-header">
                    <span className="lp-mono-eyebrow">Zero Friction Workflow</span>
                    <h2 className="lp-heading-lg">Get online in four simple steps</h2>
                    <p className="lp-body-lg">How our platform automates the deployment cycle from commit to production.</p>
                </div>

                <div className="lp-steps">
                    <div className="lp-step-card">
                        <div className="lp-step-num">01</div>
                        <h3>Connect Repository</h3>
                        <p>Sign in and choose the GitHub repository containing your frontend codebase. We support public and private git projects.</p>
                    </div>

                    <div className="lp-step-card">
                        <div className="lp-step-num">02</div>
                        <h3>Configure Settings</h3>
                        <p>Cloudify automatically detects settings like output directories or build commands. Accept the defaults or override them if needed.</p>
                    </div>

                    <div className="lp-step-card">
                        <div className="lp-step-num">03</div>
                        <h3>Automated Build</h3>
                        <p>Our platform triggers isolated build sandboxes to compile your modern frontend assets, run build scripts, and bundle pages.</p>
                    </div>

                    <div className="lp-step-card">
                        <div className="lp-step-num">04</div>
                        <h3>Deploy Live</h3>
                        <p>Get a production-grade URL live in minutes, with secure SSL activated automatically for immediate global access.</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="why-us" className="lp-section" style={{ borderTop: "1px solid var(--lp-hairline)" }}>
                <div className="lp-why-container">
                    <div className="lp-why-left">
                        <span className="lp-mono-eyebrow">Engineered for Developers</span>
                        <h2 className="lp-heading-lg">Simplify your hosting</h2>
                        <p className="lp-body-lg">
                            Other platforms require complex server setup, payment methods, or limit build counts. Cloudify is built to let you iterate fast, host frontends, and share creations without barriers.
                        </p>
                        {user ? (
                            <Link to="/projects" className="lp-btn lp-btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <button onClick={() => handleAuthRedirect("register")} className="lp-btn lp-btn-primary">
                                Create Free Account
                            </button>
                        )}
                    </div>

                    <div className="lp-comparison">
                        <div className="lp-comp-row head">
                            <div className="lp-comp-feature">Feature</div>
                            <div className="lp-comp-val">Cloudify</div>
                            <div className="lp-comp-val">Others</div>
                        </div>
                        <div className="lp-comp-row">
                            <div className="lp-comp-feature">Deployment Cost</div>
                            <div className="lp-comp-val us">Free</div>
                            <div className="lp-comp-val others">$5+/mo</div>
                        </div>
                        <div className="lp-comp-row">
                            <div className="lp-comp-feature">No Limits</div>
                            <div className="lp-comp-val us">✓</div>
                            <div className="lp-comp-val others">✗</div>
                        </div>
                        <div className="lp-comp-row">
                            <div className="lp-comp-feature">Framework Detection</div>
                            <div className="lp-comp-val us">✓</div>
                            <div className="lp-comp-val others">Limited</div>
                        </div>
                        <div className="lp-comp-row">
                            <div className="lp-comp-feature">Auto Builds</div>
                            <div className="lp-comp-val us">✓</div>
                            <div className="lp-comp-val others">✓</div>
                        </div>
                        <div className="lp-comp-row">
                            <div className="lp-comp-feature">Custom Domain SSL</div>
                            <div className="lp-comp-val us">Free</div>
                            <div className="lp-comp-val others">Paid/Complex</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="lp-final-cta">
                <div className="lp-final-cta-gradient"></div>
                <div className="lp-final-cta-container">
                    <h2 className="lp-display-xl">Launch your frontend today.</h2>
                    <p>Connect your GitHub repository and watch your application build and launch globally in under 5 minutes.</p>
                    {user ? (
                        <Link to="/projects" className="lp-btn lp-btn-primary">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <button onClick={() => handleAuthRedirect("register")} className="lp-btn lp-btn-primary">
                            Deploy Now
                        </button>
                    )}
                </div>
            </section>

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
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how-it-works">How It Works</a></li>
                                <li><a href="#why-us">Comparison</a></li>
                            </ul>
                        </div>
                        <div className="lp-footer-col">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="https://github.com/avishek0769/Cloudify" target="_blank" rel="noreferrer">GitHub</a></li>
                                {/* <li><a href="#docs">Documentation</a></li> */}
                                {/* <li><a href="#status">System Status</a></li> */}
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
