import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useApi } from "./lib/api";
import DeploymentsPage from "./pages/DeploymentsPage";
import ProjectsPage from "./pages/ProjectsPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";

function AppShell() {
    const { isSignedIn, isLoaded } = useAuth();
    const callApi = useApi();

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

    const loadProjects = useCallback(async () => {
        setProjectsLoading(true);
        try {
            const response = await callApi("/project/all");
            setProjects(response?.data?.projects || []);
        } finally {
            setProjectsLoading(false);
        }
    }, [callApi]);

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
    }, [callApi]);

    // Load projects whenever the user signs in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            loadProjects();
        }
        if (isLoaded && !isSignedIn) {
            setProjects([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, isSignedIn]);

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
        if (!isSignedIn) return false;

        setProjectMutationLoading(true);
        setProjectError("");

        try {
            const payload = {
                name: projectForm.name,
                slug: projectForm.slug,
                githubUrl: projectForm.githubUrl,
                customDomain:
                    projectForm.useCustomDomain && projectForm.customDomain
                        ? projectForm.customDomain
                        : null,
            };
            const response = await callApi("/project/create", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const newProjectId = response?.data?.newProject?.id;
            setProjectForm({
                name: "",
                slug: "",
                githubUrl: "",
                customDomain: "",
                useCustomDomain: false,
            });
            setSlugState({ checking: false, available: null });
            await loadProjects();
            return newProjectId || true;
        } catch (error) {
            setProjectError(error.message || "Could not create project");
            return false;
        } finally {
            setProjectMutationLoading(false);
        }
    };

    const refreshAll = async () => {
        if (!isSignedIn) return;
        await loadProjects();
        setRefreshTick((previous) => previous + 1);
    };

    // Show nothing while Clerk is still loading its session
    if (!isLoaded) return null;

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/projects"
                element={
                    isSignedIn ? (
                        <ProjectsPage
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
                        <Navigate to="/" replace />
                    )
                }
            />
            <Route
                path="/projects/:projectId/deployments"
                element={
                    isSignedIn ? (
                        <DeploymentsPage
                            projects={projects}
                            loadProjectById={loadProjectById}
                            refreshTick={refreshTick}
                            refreshAll={refreshAll}
                        />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
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
