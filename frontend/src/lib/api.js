const API_BASE = "/api/v1";

const callApi = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(body.message || body.error || "Request failed");
    }

    return body;
};

export { callApi };
