const URL = "https://bicycle.thegreenway.dk/api";

// Helper function to handle HTTP errors
async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorData = await res.json(); // Wait for the JSON to resolve
        return Promise.reject({ status: res.status, fullError: errorData });
    }
    return res.json();
}

function apiFacade() {
    // Store token in localStorage
    const setToken = (token) => {
        localStorage.setItem("jwtToken", token);
    };

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem("jwtToken");
    };

    // Check if user is logged in
    const loggedIn = () => {
        return getToken() != null;
    };

    // Logout and remove token
    const logout = () => {
        localStorage.removeItem("jwtToken");
    };

    // Get user roles from the JWT token
    const getUserRoles = () => {
        const token = getToken();
        if (token) {
            try {
                const payloadBase64 = token.split(".")[1];
                const decodedClaims = JSON.parse(window.atob(payloadBase64));
                return Array.isArray(decodedClaims.roles) ? decodedClaims.roles : [];
            } catch (error) {
                console.error("Error decoding JWT:", error);
                return [];
            }
        }
        return [];
    };

    // Check if user has the required role for access
    const hasUserAccess = (neededRole) => {
        const roles = getUserRoles();
        return roles.includes(neededRole);
    };

    // Login function
    const login = (username, password) => {
        const options = makeOptions("POST", false, { username, password });
        return fetch(`${URL}/auth/login`, options)
            .then(handleHttpErrors)
            .then((res) => {
                setToken(res.token);
            });
    };

    // Function to fetch data with authorization (JWT)
    const fetchWithAuth = async (endpoint, method = "GET", body = null) => {
        const options = makeOptions(method, true, body);
        try {
            const res = await fetch(`${URL}${endpoint}`, options);
            return handleHttpErrors(res); // Handles errors and parses the response
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error; // Re-throw to handle in the caller
        }
    };

    // Helper function to create fetch options
    const makeOptions = (method, addToken, body) => {
        const opts = {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        if (addToken && loggedIn()) {
            opts.headers["Authorization"] = `Bearer ${getToken()}`;
        }

        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    };

    // Submit a new bicycle
    const submitBicycle = async (bicycleData) => {
        return fetchWithAuth("/bicycles", "POST", bicycleData);
    };

    return {
        setToken,
        getToken,
        loggedIn,
        logout,
        getUserRoles,
        hasUserAccess,
        login,
        fetchWithAuth,
        submitBicycle,
    };
}

const facade = apiFacade();
export default facade;
