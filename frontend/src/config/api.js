// API Configuration
// Remove trailing slash if present
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const API_ENDPOINTS = {
  // User endpoints
  REGISTER: `${API_BASE_URL}/api/users/register`,
  LOGIN: `${API_BASE_URL}/api/users/login`,
  LOGOUT: `${API_BASE_URL}/api/users/logout`,
  CHECK_LOGIN: `${API_BASE_URL}/api/users/checkLogin`,
  UPDATE_CREDITS: `${API_BASE_URL}/api/users/updateCredits`,
  UPDATE_PLAN: `${API_BASE_URL}/api/users/updatePlan`,

  // Project endpoints
  PROJECTS: `${API_BASE_URL}/api/projects`,
  PROJECT_BY_ID: (id) => `${API_BASE_URL}/api/projects/${id}`,
  PROJECT_STATUS: (id) => `${API_BASE_URL}/api/projects/${id}/status`,
  PROJECT_BY_STATUS: (status) => `${API_BASE_URL}/api/projects/status/${status}`,
  PROJECT_ADD_ASSETS: (id) => `${API_BASE_URL}/api/projects/${id}/assets/add`,
  PROJECT_REMOVE_ASSETS: (id) => `${API_BASE_URL}/api/projects/${id}/assets/remove`,

  // Asset endpoints
  ASSETS: `${API_BASE_URL}/api/assets`,
  ASSET_BY_ID: (id) => `${API_BASE_URL}/api/assets/${id}`,

  // Style preset endpoints
  STYLES: `${API_BASE_URL}/api/styles`,

  //Get project output
  PROJECT_OUTPUT: (id) => `${API_BASE_URL}/api/output/${id}`,
  USER_ALL_THUMBNAILS: `${API_BASE_URL}/api/output/user/all`,

  //Ai enpoints
  ENHANCE_PROMPT: `${API_BASE_URL}/api/ai/enhance-prompt`,
  GENERATE_IMAGE: `${API_BASE_URL}/api/ai/generate-image`
};

export default API_BASE_URL;
