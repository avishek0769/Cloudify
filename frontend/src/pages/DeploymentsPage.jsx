import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateDeploymentModal from "../components/CreateDeploymentModal";
import { callApi } from "../lib/api";
import { isoToReadable } from "../lib/date";

function DeploymentsPage({ projects, loadProjectById, refreshTick }) {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [deployments, setDeployments] = useState([]);
    const [deploymentsLoading, setDeploymentsLoading] = useState(false);
    const [selectedDeploymentId, setSelectedDeploymentId] = useState("");
    const [persistedLogs, setPersistedLogs] = useState([]);
    const [liveLogs, setLiveLogs] = useState([]);
    const [logsStatus, setLogsStatus] = useState("");
    const [logsLoading, setLogsLoading] = useState(false);
    const [logsError, setLogsError] = useState("");

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deployPath, setDeployPath] = useState("");
    const [deploying, setDeploying] = useState(false);
    const [deployError, setDeployError] = useState("");
    const hasInitialSelection = useRef(false);

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === projectId) || null,
        [projects, projectId],
    );

    const selectedDeployment = useMemo(
        () =>
            deployments.find(
                (deployment) => deployment.id === selectedDeploymentId,
            ) || null,
        [deployments, selectedDeploymentId],
    );

    const loadDeployments = useCallback(async () => {
        if (!projectId) return;
        setDeploymentsLoading(true);
        try {
            const response = await callApi(`/deployment/all/${projectId}`);
            const list = [...(response?.data?.deployments || [])].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );
            setDeployments(list);

            let nextSelectedId = "";
            setSelectedDeploymentId((previous) => {
                if (list.length === 0) {
                    nextSelectedId = "";
                    return "";
                }

                if (!hasInitialSelection.current) {
                    hasInitialSelection.current = true;
                    nextSelectedId = list[0].id;
                    return list[0].id;
                }

                if (
                    previous &&
                    list.some((deployment) => deployment.id === previous)
                ) {
                    nextSelectedId = previous;
                    return previous;
                }

                nextSelectedId = list[0].id;
                return list[0].id;
            });

            return nextSelectedId;
        } finally {
            setDeploymentsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        hasInitialSelection.current = false;
        setSelectedDeploymentId("");
    }, [projectId]);

    const loadPersistedLogs = useCallback(async (deploymentId) => {
        if (!deploymentId) {
            setPersistedLogs([]);
            setLiveLogs([]);
            setLogsStatus("");
            return;
        }

        setLogsLoading(true);
        setLogsError("");
        try {
            const response = await callApi(
                `/logs/deployment/all/${deploymentId}`,
            );
            setPersistedLogs(response?.data?.logs || []);
        } catch (error) {
            setLogsError(error.message || "Could not load logs");
        } finally {
            setLogsLoading(false);
        }
    }, []);

    const loadDeploymentDetails = useCallback(async (deploymentId) => {
        if (!deploymentId) return null;

        try {
            const response = await callApi(
                `/deployment/details/${deploymentId}`,
            );
            const deployment = response?.data?.deployment || null;
            if (!deployment?.id) return null;

            setDeployments((previous) =>
                previous.map((entry) =>
                    entry.id === deployment.id ? { ...entry, ...deployment } : entry,
                ),
            );
            return deployment;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        if (!selectedProject && projectId) {
            loadProjectById(projectId);
        }
    }, [selectedProject, projectId, loadProjectById]);

    useEffect(() => {
        loadDeployments();
    }, [loadDeployments]);

    useEffect(() => {
        setLiveLogs([]);
        setLogsStatus("");
        loadPersistedLogs(selectedDeploymentId);
    }, [selectedDeploymentId, loadPersistedLogs]);

    useEffect(() => {
        if (!selectedDeploymentId) return undefined;
        if (selectedDeployment?.status === "READY") return undefined;

        let stop = false;
        const interval = setInterval(async () => {
            if (stop) return;
            try {
                const response = await callApi(
                    `/logs/deployment/${selectedDeploymentId}`,
                );
                const nextLogs = response?.data?.logs || [];
                const nextStatus = response?.data?.logsStatus || "";

                if (nextLogs.length) {
                    setLiveLogs((previous) => [
                        ...previous,
                        ...nextLogs.map((log) => ({
                            id: crypto.randomUUID(),
                            log,
                            createdAt: new Date().toISOString(),
                        })),
                    ]);
                }

                if (nextStatus) {
                    setLogsStatus(selectedDeployment?.status || "");
                    if (nextStatus === "end") {
                        stop = true;
                        clearInterval(interval);
                        loadPersistedLogs(selectedDeploymentId);
                    }
                }
            } catch {
                // Ignore polling failures while build webhook has not started streaming.
            }
        }, 3000);

        return () => {
            stop = true;
            clearInterval(interval);
        };
    }, [selectedDeploymentId, selectedDeployment?.status, loadPersistedLogs]);

    useEffect(() => {
        const refreshPage = async () => {
            const activeDeploymentId = await loadDeployments();
            if (activeDeploymentId) {
                await loadDeploymentDetails(activeDeploymentId);
                await loadPersistedLogs(activeDeploymentId);
            }
        };

        refreshPage();
    }, [refreshTick, loadDeployments, loadPersistedLogs, loadDeploymentDetails]);

    const createDeployment = async () => {
        if (!projectId) return;

        setDeploying(true);
        setDeployError("");
        try {
            const query = deployPath.trim()
                ? `?pathToPackageJson=${encodeURIComponent(deployPath.trim())}`
                : "";
            const response = await callApi(
                `/deployment/create/${projectId}${query}`,
                {
                    method: "POST",
                },
            );
            const created = response?.data;
            if (created?.id) {
                setDeployments((previous) => [created, ...previous]);
                setSelectedDeploymentId(created.id);
            }
            setCreateModalOpen(false);
            setDeployPath("");
        } catch (error) {
            setDeployError(error.message || "Deployment failed to queue");
        } finally {
            setDeploying(false);
        }
    };

    return (
        <section className="page-grid">
            <aside className="panel">
                <div className="panel-head">
                    <h3>Deployments</h3>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate("/projects")}
                    >
                        Back to Projects
                    </button>
                </div>
                <p className="project-name">
                    {selectedProject?.name || "Loading project..."}
                </p>
                <p className="muted mono">
                    {selectedProject?.githubUrl || "Loading project..."}
                </p>

                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                        setDeployError("");
                        setCreateModalOpen(true);
                    }}
                >
                    Create Deployment
                </button>

                <div className="list-wrap">
                    {deploymentsLoading && (
                        <p className="muted">Loading deployments...</p>
                    )}
                    {!deploymentsLoading && deployments.length === 0 && (
                        <p className="muted">No deployments yet.</p>
                    )}

                    {deployments.map((deployment) => (
                        <button
                            key={deployment.id}
                            className={`list-item ${
                                deployment.id === selectedDeploymentId
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedDeploymentId(deployment.id)
                            }
                            type="button"
                        >
                            <p className="item-title mono">
                                {deployment.id.slice(0, 12)}
                            </p>
                            <p className="muted">
                                {deployment.status || "QUEUED"}
                            </p>
                            <span className="item-pill">
                                {isoToReadable(deployment.createdAt)}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            <section className="panel">
                <div className="panel-head">
                    <h3>Deployment Details & Logs</h3>
                </div>

                {!selectedDeployment && (
                    <p className="muted">
                        Choose a deployment from the left panel.
                    </p>
                )}

                {selectedDeployment && (
                    <>
                        <div className="stats-grid">
                            <article>
                                <h4>Status</h4>
                                <p className="stat">
                                    {logsStatus ||
                                        selectedDeployment.status ||
                                        "-"}
                                </p>
                            </article>
                            <article>
                                <h4>Created</h4>
                                <p className="stat">
                                    {isoToReadable(
                                        selectedDeployment.createdAt,
                                    )}
                                </p>
                            </article>
                            <article>
                                <h4>Updated</h4>
                                <p className="stat">
                                    {isoToReadable(
                                        selectedDeployment.updatedAt,
                                    )}
                                </p>
                            </article>
                            <article>
                                <h4>Preview URL</h4>
                                <p className="stat mono">
                                    {selectedProject?.subdomain
                                        ? (
                                            <a
                                                href={`https://${selectedProject.subdomain}.cloudify.avishekadhikary.tech`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="preview-link"
                                            >
                                                https://{selectedProject.subdomain}.cloudify.avishekadhikary.tech
                                            </a>
                                        )
                                        : "-"}
                                </p>
                            </article>
                        </div>

                        {logsLoading && (
                            <p className="muted">Loading persisted logs...</p>
                        )}
                        {logsError && <p className="error-text">{logsError}</p>}

                        <div
                            className={`terminal ${
                                selectedDeployment?.status === "READY"
                                    ? "terminal-full"
                                    : ""
                            }`}
                        >
                            <p className="terminal-title">Persisted Logs</p>
                            {persistedLogs.length === 0 && (
                                <p className="muted mono">
                                    No stored logs yet.
                                </p>
                            )}
                            {persistedLogs.map((entry) => (
                                <div className="log-line" key={entry.id}>
                                    <span className="mono dim">
                                        [{isoToReadable(entry.createdAt)}]
                                    </span>
                                    <span className="mono">{entry.log}</span>
                                </div>
                            ))}
                        </div>

                        {selectedDeployment?.status !== "READY" && (
                            <div className="terminal">
                                <p className="terminal-title">Live Stream</p>
                                {liveLogs.length === 0 && (
                                    <p className="muted mono">
                                        Waiting for new log events...
                                    </p>
                                )}
                                {liveLogs.map((entry) => (
                                    <div className="log-line" key={entry.id}>
                                        <span className="mono dim">
                                            [{isoToReadable(entry.createdAt)}]
                                        </span>
                                        <span className="mono">{entry.log}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>

            <CreateDeploymentModal
                isOpen={createModalOpen}
                pathValue={deployPath}
                setPathValue={setDeployPath}
                onClose={() => setCreateModalOpen(false)}
                onConfirm={createDeployment}
                deploying={deploying}
                deployError={deployError}
            />
        </section>
    );
}

export default DeploymentsPage;
