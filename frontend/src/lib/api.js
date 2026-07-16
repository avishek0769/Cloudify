import { useCallback } from "react";
import { useAuth } from "@clerk/react";

const API_BASE = "/api/v1";

const useApi = () => {
    const { getToken } = useAuth();
    
    const callApi = useCallback(async (path, options = {}) => {
        const token = await getToken();

        const response = await fetch(`${API_BASE}${path}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...(options.headers || {}),
            },
            ...options,
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(body.message || body.error || "Request failed");
        }

        return body;
    }, [getToken]);

    return callApi;
};

export { useApi };
