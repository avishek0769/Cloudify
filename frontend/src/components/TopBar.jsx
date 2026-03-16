function TopBar({ user, onRefresh }) {
    return (
        <header className="topbar reveal">
            <div>
                <p className="eyebrow">Deployment Console</p>
                <h2>{user.fullname}</h2>
            </div>
            <div className="topbar-actions">
                <button
                    onClick={onRefresh}
                    className="btn btn-ghost"
                    type="button"
                >
                    Refresh
                </button>
                <span className="user-chip">{user.email}</span>
            </div>
        </header>
    );
}

export default TopBar;
