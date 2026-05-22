const AUTH_KEY = "tradestream_user";

export function saveUser({ userId, name, email }) {
  const payload = { userId, name, email };
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  return payload;
}

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const user = getUser();
  return Boolean(user?.userId);
}

export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

export function logout() {
  clearUser();
  const frontendUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";
  window.location.href = frontendUrl;
}

export function initAuthFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const name = params.get("name");
  const email = params.get("email");

  if (userId) {
    saveUser({
      userId,
      name: name || "User",
      email: email || "",
    });

    params.delete("userId");
    params.delete("name");
    params.delete("email");
    const query = params.toString();
    const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  return getUser();
}
