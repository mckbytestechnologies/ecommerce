import axios from "./axios";

// Admin login
export const loginAdmin = async (email, password) => {
  const res = await axios.post("/auth/login", { email, password });
  return res.data;
};

// Optional: get current logged-in user
export const getProfile = async () => {
  const res = await axios.get("/auth/profile");
  return res.data;
};
