import { useNavigate } from "react-router-dom";
import { isoToReadable } from "../lib/date";

function ProjectsPage({
    projects,
    projectsLoading,
    projectForm,
    setProjectForm,
    slugState,
    checkSlug,
    projectMutationLoading,
    projectError,
    handleProjectCreate,
}) {
    const navigate = useNavigate();

    return (
        <section className="page-grid projects-layout projects-page">
            <section className="panel projects-list-panel">
                <div className="panel-head">
                    <div className="panel-title-group">
                        <h3>Projects</h3>
                        <p className="muted panel-subtitle">
                            Tap a project card to open its deployments.
                        </p>
                    </div>
                    {projectsLoading && (
                        <span className="muted">Loading...</span>
                    )}
                </div>

                <div className="list-wrap">
                    {projects.length === 0 && (
                        <p className="muted">
                            No projects yet. Create one to continue.
                        </p>
                    )}
                    {projects.map((project) => (
                        <article
                            key={project.id}
                            className="list-item project-card"
                            onClick={() =>
                                navigate(`/projects/${project.id}/deployments`)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    navigate(`/projects/${project.id}/deployments`);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="project-card-head">
                                <p className="item-title">{project.name}</p>
                                <span className="item-pill">
                                    {isoToReadable(project.createdAt)}
                                </span>
                            </div>

                            <div className="project-card-info">
                                <p className="muted mono">
                                    Subdomain: {project.subdomain}
                                </p>
                                <p className="muted mono project-github">
                                    Repo: {project.githubUrl}
                                </p>
                                <div>
                                    <a
                                        href={`https://${project.subdomain}.vercel.avishekadhikary.tech`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="preview-link mono"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        https://{project.subdomain}.vercel.avishekadhikary.tech
                                    </a>
                                </div>
                            </div>

                            <div className="project-card-footer">
                                <span className="project-card-cta mono">
                                    Open deployments
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel create-project-panel">
                <div className="panel-head">
                    <div className="panel-title-group">
                        <h3>Create Project</h3>
                        <p className="muted panel-subtitle">
                            Add your repo and reserve a unique subdomain.
                        </p>
                    </div>
                </div>
                <form
                    className="form-grid compact"
                    onSubmit={handleProjectCreate}
                >
                    <label>
                        Project name
                        <input
                            value={projectForm.name}
                            onChange={(event) =>
                                setProjectForm((previous) => ({
                                    ...previous,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="my-app"
                            required
                        />
                    </label>
                    <label>
                        Subdomain slug
                        <input
                            value={projectForm.slug}
                            onChange={(event) =>
                                setProjectForm((previous) => ({
                                    ...previous,
                                    slug: event.target.value,
                                }))
                            }
                            onBlur={checkSlug}
                            placeholder="my-app"
                            required
                        />
                    </label>
                    <label>
                        GitHub URL
                        <input
                            value={projectForm.githubUrl}
                            onChange={(event) =>
                                setProjectForm((previous) => ({
                                    ...previous,
                                    githubUrl: event.target.value,
                                }))
                            }
                            placeholder="https://github.com/user/repo"
                            required
                        />
                    </label>

                    {slugState.checking && (
                        <p className="muted">Checking slug...</p>
                    )}
                    {slugState.available === true && (
                        <p className="success-text">Slug is available.</p>
                    )}
                    {slugState.available === false && (
                        <p className="error-text">Slug is not available.</p>
                    )}
                    {projectError && (
                        <p className="error-text">{projectError}</p>
                    )}

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={projectMutationLoading}
                    >
                        {projectMutationLoading
                            ? "Creating..."
                            : "Create Project"}
                    </button>
                </form>
            </section>
        </section>
    );
}

export default ProjectsPage;
