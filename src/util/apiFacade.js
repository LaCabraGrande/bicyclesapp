const URL = "https://bicycle.thegreenway.dk/api";

// Helper function to handle HTTP errors
function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() });
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

    // Decode JWT token to get user roles
    const getUserRoles = () => {
        const token = getToken();
        if (token != null) {
            const payloadBase64 = token.split(".")[1];
            const decodedClaims = JSON.parse(window.atob(payloadBase64));
            return decodedClaims.roles || [];
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
            return handleHttpErrors(res);
        } catch (error) {
            throw new Error(`Error fetching ${endpoint}: ${error}`);
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

    // Fetch guides, including authentication
    const fetchGuides = () => {
        return fetchWithAuth("/guides", "GET")
            .then((guides) => {
                return guides;
            })
            .catch((error) => {
                console.error("Error fetching guides:", error);
                throw new Error("Error fetching guides");
            });
    };

    const fetchPackingItems = async (categoryType) => {
        console.log("Fetching packing items with categoryType:", categoryType); // Log categoryType
        if (!categoryType) {
            console.error("categoryType is undefined or null");
            throw new Error("categoryType is required for fetching packing items");
        }
        const endpoint = `https://trips.thegreenway.dk/api/trips/packing-list/${categoryType}`;
        try {
            const res = await fetch(endpoint);
            if (!res.ok) {
                console.error("Failed to fetch packing items, status:", res.status);
                throw new Error(`Failed to fetch packing items: ${res.statusText}`);
            }
            const data = await res.json();
            console.log("Packing items fetched successfully:", data); // Log successful data
            return data;
        } catch (error) {
            console.error("Error fetching packing items:", error);
            throw new Error("Could not fetch packing items");
        }
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
        fetchGuides,
        fetchPackingItems, // Returner den opdaterede metode
    };
}

const facade = apiFacade();
export default facade;
