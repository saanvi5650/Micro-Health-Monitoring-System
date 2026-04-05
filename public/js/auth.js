/* ============================================================
   auth.js  — handles citizen login, admin login, register
   ============================================================ */

/* ─── Citizen Login ─── */
async function citizenLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button[type=submit]");
  const email    = document.getElementById("citizenEmail").value.trim();
  const password = document.getElementById("citizenPassword").value;

  if (!email || !password) { showToast("Please fill in all fields", "error"); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in…';

  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userId", data.user._id || data.user.id || "");

      showToast("Welcome back! Redirecting…", "success", 1500);
      setTimeout(() => {
        if (data.user.role === "admin") {
          window.location.href = "/admin/admin-dashboard.html";
        } else {
          window.location.href = "/citizen/dashboard.html";
        }
      }, 1000);
    } else {
      showToast(data.message || "Invalid credentials", "error");
    }
  } catch (err) {
    showToast(err.message || "Login failed. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Sign In";
  }
}

/* ─── Admin Login ─── */
async function adminLogin(e) {
  e.preventDefault();
  const btn      = e.target.querySelector("button[type=submit]");
  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value;

  if (!username || !password) { showToast("Please fill in all fields", "error"); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in…';

  try {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
    });

    if (data.user && data.user.role === "admin") {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", data.user._id || data.user.id || "");

      showToast("Admin access granted!", "success", 1500);
      setTimeout(() => window.location.href = "/admin/admin-dashboard.html", 1000);
    } else if (data.user) {
      showToast("Not authorised as admin", "error");
    } else {
      showToast(data.message || "Invalid admin credentials", "error");
    }
  } catch (err) {
    showToast(err.message || "Login failed. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Sign In";
  }
}