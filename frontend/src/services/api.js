import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.axios.defaults.headers.common["Authorization"];
    }
  }

  // Generic methods
  get(url, config = {}) {
    return this.axios.get(url, config);
  }

  post(url, data, config = {}) {
    return this.axios.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.axios.put(url, data, config);
  }

  delete(url, config = {}) {
    return this.axios.delete(url, config);
  }

  // Auth endpoints
  auth = {
    login: (credentials) => this.post("/auth/login", credentials),
    register: (userData) => this.post("/auth/register", userData),
  };

  // User endpoints
  users = {
    getProfile: () => this.get("/users/profile"),
    updateProfile: (data) => this.put("/users/profile", data),
    getUsers: (params) => this.get("/users", { params }),
    getUserById: (userId) => this.get(`/users/${userId}`),
    updateUserStatus: (userId, isActive) =>
      this.put(`/users/${userId}/status`, { isActive }),
  };

  // Herb endpoints
  herbs = {
    getHerbs: (params) => this.get("/herbs", { params }),
    getMyHerbs: () => this.get("/herbs/my-herbs"),
    searchHerbs: (query) => this.get("/herbs/search", { params: { q: query } }),
    getStats: () => this.get("/herbs/stats"),
    updateMetadata: (herbId, metadata) =>
      this.put(`/herbs/${herbId}/metadata`, { metadata }),
  };

  // Fabric/Blockchain endpoints
  fabric = {
    recordCollection: (data) => this.post("/fabric/collect", data),
    addQualityTest: (data) => this.post("/fabric/quality-test", data),
    addProcessingStep: (data) => this.post("/fabric/process", data),
    getHerbJourney: (herbId) => this.get(`/fabric/herb/${herbId}`),
    traceByQR: (qrCode) => this.post("/fabric/trace", { qrCode }),
    getHerbBatches: (params) => this.get("/fabric", { params }),
  };

  // Health check
  health = () => axios.get(`${API_BASE_URL.replace("/api", "")}/health`);
}

const api = new ApiService();

export default api;
