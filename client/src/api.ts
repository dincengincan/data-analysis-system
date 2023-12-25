export const baseApiUrl = import.meta.env.PROD
  ? `${import.meta.env.VITE_BASE_URL}/api/genes`
  : "http://localhost:8080/api/genes";
