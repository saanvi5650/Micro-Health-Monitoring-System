/* ============================================================
   admin-alerts.js
   ============================================================ */

requireAuth("admin");

async function loadAlerts() {
  const container = document.getElementById("alertsContainer");
  if (!container) return;

  try {
    const data = await apiFetch("/api/health/reports");
    const highRisk = data.filter(d => d.riskLevel === "High");

    if (!highRisk.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>No High-Risk Patients</h3>
          <p>All monitored patients are currently within normal parameters.</p>
        </div>`;
      return;
    }

    container.innerHTML = highRisk.map(p => `
      <div class="alert alert-danger" style="margin-bottom:12px;">
        <span class="alert-icon">🚨</span>
        <div class="alert-body">
          <strong>${p.name || "Unknown Patient"}</strong>
          Temperature: ${p.temperature ? p.temperature + "°C" : "N/A"} &nbsp;|&nbsp;
          BP: ${p.bp || "N/A"} &nbsp;|&nbsp;
          Risk: ${riskBadge(p.riskLevel)}
          ${p.symptoms ? `<br><span class="text-muted" style="font-size:13px;">Symptoms: ${p.symptoms}</span>` : ""}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="viewPatient('${p._id || p.id}')">View</button>
      </div>`).join("");
  } catch (err) {
    showToast("Failed to load alerts", "error");
    container.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div class="alert-body">Could not load alert data. Please check your connection.</div></div>`;
  }
}

function viewPatient(id) {
  if (id) localStorage.setItem("viewPatientId", id);
  window.location.href = "patient-details.html";
}

document.addEventListener("DOMContentLoaded", function () {
  loadAlerts();
  setInterval(loadAlerts, 10000); // refresh every 10s
});