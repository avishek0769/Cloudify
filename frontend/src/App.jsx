import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AuthView from "./components/AuthView";
import { callApi } from "./lib/api";
import DeploymentsPage from "./pages/DeploymentsPage";
import ProjectsPage from "./pages/ProjectsPage";
import LandingPage from "./pages/LandingPage";

function AppShell() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [authMode, setAuthMode] = useState("login");
    const [authForm, setAuthForm] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectForm, setProjectForm] = useState({
        name: "",
        slug: "",
        githubUrl: "",
        customDomain: "",
        useCustomDomain: false,
    });
    const [slugState, setSlugState] = useState({
        checking: false,
        available: null,
    });
    const [projectMutationLoading, setProjectMutationLoading] = useState(false);
    const [projectError, setProjectError] = useState("");
    const [refreshTick, setRefreshTick] = useState(0);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const mode = params.get("mode");
        if (mode === "login" || mode === "register") {
            setAuthMode(mode);
        }
    }, [location.search]);

    const loadProfile = useCallback(async () => {
        const response = await callApi("/user/profile");
        setUser(response.user);
        return response.user;
    }, []);

    const loadProjects = useCallback(async (userId) => {
        setProjectsLoading(true);
        try {
            const response = await callApi(`/project/all/${userId}`);
            setProjects(response?.data?.projects || []);
        } finally {
            setProjectsLoading(false);
        }
    }, []);

    const loadProjectById = useCallback(async (projectId) => {
        try {
            const response = await callApi(`/project/${projectId}`);
            const project = response?.data?.project;
            if (!project) return;
            setProjects((previous) =>
                previous.some((entry) => entry.id === project.id)
                    ? previous
                    : [project, ...previous],
            );
        } catch {
            // Ignore errors while route attempts to resolve project metadata.
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const bootstrap = async () => {
            try {
                const currentUser = await loadProfile();
                if (mounted && currentUser?.id) {
                    await loadProjects(currentUser.id);
                }
            } catch {
                if (mounted) setUser(null);
            }
        };

        bootstrap();
        return () => {
            mounted = false;
        };
    }, [loadProfile, loadProjects]);

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setAuthError("");
        setAuthLoading(true);

        try {
            if (authMode === "register") {
                await callApi("/user/register", {
                    method: "POST",
                    body: JSON.stringify({
                        fullname: authForm.fullname,
                        email: authForm.email,
                        password: authForm.password,
                    }),
                });
            } else {
                await callApi("/user/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email: authForm.email,
                        password: authForm.password,
                    }),
                });
            }

            const currentUser = await loadProfile();
            if (currentUser?.id) {
                await loadProjects(currentUser.id);
                navigate("/projects", { replace: true });
            }
        } catch (error) {
            setAuthError(error.message || "Authentication failed");
        } finally {
            setAuthLoading(false);
        }
    };

    const checkSlug = async () => {
        const cleanedSlug = projectForm.slug.trim();
        if (!cleanedSlug) {
            setSlugState({ checking: false, available: null });
            return;
        }

        setSlugState({ checking: true, available: null });
        try {
            const response = await callApi(`/project/slug/${cleanedSlug}`);
            setSlugState({
                checking: false,
                available: !!response?.data?.available,
            });
        } catch {
            setSlugState({ checking: false, available: false });
        }
    };

    const handleProjectCreate = async (event) => {
        event.preventDefault();
        if (!user?.id) return false;

        setProjectMutationLoading(true);
        setProjectError("");

        try {
            const payload = {
                name: projectForm.name,
                slug: projectForm.slug,
                githubUrl: projectForm.githubUrl,
                customDomain: projectForm.useCustomDomain && projectForm.customDomain ? projectForm.customDomain : null,
            };
            await callApi("/project/create", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setProjectForm({
                name: "",
                slug: "",
                githubUrl: "",
                customDomain: "",
                useCustomDomain: false,
            });
            setSlugState({ checking: false, available: null });
            await loadProjects(user.id);
            return true;
        } catch (error) {
            setProjectError(error.message || "Could not create project");
            return false;
        } finally {
            setProjectMutationLoading(false);
        }
    };

    const refreshAll = async () => {
        if (!user?.id) return;
        await loadProjects(user.id);
        setRefreshTick((previous) => previous + 1);
    };

    return (
        <Routes>
            <Route path="/" element={<LandingPage user={user} setAuthMode={setAuthMode} />} />
            <Route
                path="/auth"
                element={
                    user ? (
                        <Navigate to="/projects" replace />
                    ) : (
                        <AuthView
                            authMode={authMode}
                            setAuthMode={setAuthMode}
                            authForm={authForm}
                            setAuthForm={setAuthForm}
                            authLoading={authLoading}
                            authError={authError}
                            onSubmit={handleAuthSubmit}
                        />
                    )
                }
            />
            <Route
                path="/projects"
                element={
                    user ? (
                        <ProjectsPage
                            user={user}
                            setUser={setUser}
                            projects={projects}
                            projectsLoading={projectsLoading}
                            projectForm={projectForm}
                            setProjectForm={setProjectForm}
                            slugState={slugState}
                            checkSlug={checkSlug}
                            projectMutationLoading={projectMutationLoading}
                            projectError={projectError}
                            handleProjectCreate={handleProjectCreate}
                        />
                    ) : (
                        <Navigate to="/auth?mode=login" replace />
                    )
                }
            />
            <Route
                path="/projects/:projectId/deployments"
                element={
                    user ? (
                        <main className="screen shell">
                            <DeploymentsPage
                                projects={projects}
                                loadProjectById={loadProjectById}
                                refreshTick={refreshTick}
                            />
                        </main>
                    ) : (
                        <Navigate to="/auth?mode=login" replace />
                    )
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;
