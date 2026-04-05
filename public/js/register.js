/* ============================================================
   register.js
   ============================================================ */

async function registerUser(e) {
  e.preventDefault();
  const btn      = document.getElementById("registerBtn");
  const name     = document.getElementById("name").value.trim();
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role     = document.getElementById("role").value;

  // basic validation
  const emailErr = document.getElementById("emailError");
  const passErr  = document.getElementById("passError");
  if (emailErr) emailErr.textContent = "";
  if (passErr)  passErr.textContent  = "";

  if (!name || !email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  if (password.length < 6) {
    if (passErr) passErr.textContent = "Password must be at least 6 characters";
    showToast("Password too short", "error");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account…';

  try {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    showToast(data.message || "Registered successfully!", "success", 2000);

    setTimeout(() => {
      window.location.href =
        role === "admin"
          ? "/auth/admin-login.html"
          : "/auth/citizen-login.html";
    }, 1500);
  } catch (err) {
    showToast(err.message || "Registration failed. Please try again.", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Create Account";
  }
}