import axios from "axios";

// Store in module scope (not React state) so it persists across components
let accessToken = null;
let accessTokenExpiry = null; // timestamp in ms
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true; // send cookies (refresh token)

export const setAccessToken = (token, expiresInSec) => {
  accessToken = token;
  accessTokenExpiry = Date.now() + expiresInSec * 1000;
};

// Ensure valid token before request
const getValidAccessToken = async () => {
  // If no token or expired → refresh
  if (!accessToken || Date.now() >= accessTokenExpiry) {
    const res = await axios.post(`${API_BASE_URL}/api/refresh`, {}, { withCredentials: true });
    setAccessToken(res.data.access_token, res.data.expires_in);
  }
  return accessToken;
};

export const query = async (url, options = {}) => {
  const token = await getValidAccessToken();

  const fullURL = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  try {
    const response = await axios({
      url: fullURL,
      method: options.method || "get",
      data: options.data || options,
      params: options.params || {},
      withCredentials: true, // send cookies (refresh token)
    });
    return response.data;
  }
  catch (e) {
    console.error("[DEBUG]:Error in request")
  }
};