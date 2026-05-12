// Authentication utilities

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loginTime");
  window.dispatchEvent(new Event("authChange"));
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    alert("Please login or register to continue");
    navigate("/register");
    return false;
  }
  return true;
};