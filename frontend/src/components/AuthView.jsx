function AuthView({
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    authLoading,
    authError,
    onSubmit,
}) {
    return (
        <main className="screen auth-screen">
            <section className="auth-card reveal">
                <p className="eyebrow">Vercel Clone</p>
                <h1>Deploy in minutes</h1>
                <p className="lead">
                    Authenticate to manage projects, create deployments, and
                    inspect logs.
                </p>

                <div className="auth-switch">
                    <button
                        className={authMode === "login" ? "active" : ""}
                        onClick={() => setAuthMode("login")}
                        type="button"
                    >
                        Login
                    </button>
                    <button
                        className={authMode === "register" ? "active" : ""}
                        onClick={() => setAuthMode("register")}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                <form className="form-grid" onSubmit={onSubmit}>
                    {authMode === "register" && (
                        <label>
                            Full name
                            <input
                                value={authForm.fullname}
                                onChange={(event) =>
                                    setAuthForm((previous) => ({
                                        ...previous,
                                        fullname: event.target.value,
                                    }))
                                }
                                placeholder="Ada Lovelace"
                                required
                            />
                        </label>
                    )}
                    <label>
                        Email
                        <input
                            value={authForm.email}
                            onChange={(event) =>
                                setAuthForm((previous) => ({
                                    ...previous,
                                    email: event.target.value,
                                }))
                            }
                            type="email"
                            placeholder="you@example.com"
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input
                            value={authForm.password}
                            onChange={(event) =>
                                setAuthForm((previous) => ({
                                    ...previous,
                                    password: event.target.value,
                                }))
                            }
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </label>

                    {authError && <p className="error-text">{authError}</p>}

                    <button
                        disabled={authLoading}
                        className="btn btn-primary"
                        type="submit"
                    >
                        {authLoading
                            ? "Please wait..."
                            : authMode === "register"
                              ? "Create account"
                              : "Login"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default AuthView;
