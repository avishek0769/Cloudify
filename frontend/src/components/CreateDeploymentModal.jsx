function CreateDeploymentModal({
    isOpen,
    pathValue,
    setPathValue,
    onClose,
    onConfirm,
    deploying,
    deployError,
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" role="presentation" onClick={onClose}>
            <div
                className="modal-card"
                role="dialog"
                onClick={(event) => event.stopPropagation()}
            >
                <h4>Create Deployment</h4>
                <p className="note-text">
                    Before creating deployment, make sure your latest code is
                    pushed to your GitHub repository.
                </p>
                <label>
                    package.json folder path (optional)
                    <input
                        value={pathValue}
                        onChange={(event) => setPathValue(event.target.value)}
                        placeholder="apps/web"
                    />
                </label>
                {deployError && <p className="error-text">{deployError}</p>}
                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onConfirm}
                        disabled={deploying}
                    >
                        {deploying ? "Queueing..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateDeploymentModal;
