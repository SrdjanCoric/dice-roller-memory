const config = {
  API_BASE_URL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3001/",
};

export default config;
