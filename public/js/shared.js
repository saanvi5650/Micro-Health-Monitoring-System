/* ============================================================
   shared.js  — include on every page BEFORE page-specific JS
   ============================================================ */

/* ── Toast Notifications ── */
(function () {
  const container = document.createElement("div");
  container.id = "toast-container";
  document.body.appendChild(container);

  window.showToast = function (message, type = "success", duration = 3500) {
    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();

/* ── Auth Guard ── */
window.requireAuth = function (requiredRole) {
  const role = localStorage.getItem("role");
  if (!role) {
    window.location.href = "/auth/citizen-login.html";
    return false;
  }
  if (requiredRole && role !== requiredRole) {
    if (role === "admin") {
      window.location.href = "/admin/admin-dashboard.html";
    } else {
      window.location.href = "/citizen/dashboard.html";
    }
    return false;
  }
  return true;
};

/* ── Logout ── */
window.logout = function () {
  localStorage.clear();
  window.location.href = "/auth/citizen-login.html";
};

/* ── Highlight active nav link ── */
window.setActiveNav = function () {
  const path = window.location.pathname;
  document.querySelectorAll(".navbar nav a, .sidebar nav a").forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("href") && path.endsWith(a.getAttribute("href").split("/").pop())) {
      a.classList.add("active");
    }
  });
};
document.addEventListener("DOMContentLoaded", setActiveNav);

/* ── Safe fetch wrapper ── */
window.apiFetch = async function (url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  } catch (err) {
    throw err;
  }
};

/* ── Risk badge helper ── */
window.riskBadge = function (level) {
  const map = {
    High:   '<span class="badge badge-danger">High</span>',
    Medium: '<span class="badge badge-warning">Medium</span>',
    Low:    '<span class="badge badge-success">Low</span>',
  };
  return map[level] || `<span class="badge badge-info">${level}</span>`;
};

/* ── Status badge helper ── */
window.statusBadge = function (status) {
  const s = (status || "").toLowerCase();
  if (s === "critical" || s === "high")  return '<span class="badge badge-danger">Critical</span>';
  if (s === "warning"  || s === "medium") return '<span class="badge badge-warning">Warning</span>';
  if (s === "stable"   || s === "low")   return '<span class="badge badge-success">Stable</span>';
  return `<span class="badge badge-info">${status}</span>`;
};