import axios from "axios";


// Usuarios
const usuariosApi = axios.create({
  baseURL: window.env?.VITE_API_USER || import.meta.env.VITE_API_USER || "https://usuarios-api.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

usuariosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

usuariosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o inválido");
      localStorage.removeItem("token");
      localStorage.setItem("isLogged", "false");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


// Catalogo 

const catalogoInventarioApi = axios.create({
  baseURL: window.env?.VITE_API_CATALOGO_INVENTARIO || import.meta.env.VITE_API_CATALOGO_INVENTARIO || "https://catalogo-inventario-ebhue0g4cwfyemg7.centralus-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

catalogoInventarioApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

catalogoInventarioApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o inválido");
      localStorage.removeItem("token");
      localStorage.setItem("isLogged", "false");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Gestion Paciente


const gestionPacienteApi = axios.create({
  baseURL: window.env?.VITE_API_GESTION_PACIENTE || import.meta.env.VITE_API_GESTION_PACIENTE || "https://gestionpacienteopticloud.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

gestionPacienteApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

gestionPacienteApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o inválido");
      localStorage.removeItem("token");
      localStorage.setItem("isLogged", "false");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Historial Optometrico

const historialOptometricoApi = axios.create({
  baseURL: window.env?.VITE_API_HISTORIAL_OPTOMETRICO || import.meta.env.VITE_API_HISTORIAL_OPTOMETRICO || "https://historialoptometrico.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
  },
});

historialOptometricoApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

historialOptometricoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expirado o inválido");
      localStorage.removeItem("token");
      localStorage.setItem("isLogged", "false");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export { usuariosApi, catalogoInventarioApi, gestionPacienteApi, historialOptometricoApi };
