/* ============================================================
   citizen.js  — dashboard + monitoring + alerts
   ============================================================ */

requireAuth("citizen");

/* ─── Greeting ─── */
(function greet() {
  const el = document.getElementById("greetUser");
  if (!el) return;
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hour = new Date().getHours();
  const g = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  el.textContent = `${g}, ${user.name || "there"} 👋`;
})();

/* ─── Live Vitals Simulation ─── */
function generateVitals() {
  return {
    heart: Math.floor(Math.random() * 40) + 60,        // 60–100
    temp:  (Math.random() * 2 + 36).toFixed(1),        // 36–38
    oxy:   Math.floor(Math.random() * 5) + 95,         // 95–100
    bp:    `${Math.floor(Math.random()*20)+110}/${Math.floor(Math.random()*15)+70}` // systolic/diastolic
  };
}

function riskFromVitals(v) {
  if (v.heart > 100 || v.temp > 38 || v.oxy < 94) return "High";
  if (v.heart > 90  || v.temp > 37.5) return "Medium";
  return "Low";
}

function updateLiveVitals() {
  const v    = generateVitals();
  const risk = riskFromVitals(v);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set("liveHeart", v.heart + " bpm");
  set("liveTemp",  v.temp  + "°C");
  set("liveOxy",   v.oxy   + "%");
  set("liveBP",    v.bp);
  set("liveStatus", risk);

  // colour the status
  const statusEl = document.getElementById("liveStatus");
  if (statusEl) {
    statusEl.className = "";
    statusEl.className =
      risk === "High"   ? "text-danger font-bold" :
      risk === "Medium" ? "text-warning font-bold" : "text-success font-bold";
  }

  renderAlertBanners(v);
}

function renderAlertBanners(v) {
  const container = document.getElementById("alertsContainer");
  if (!container) return;
  let html = "";
  if (v.heart > 100) html += `<div class="alert alert-danger"><span class="alert-icon">❤️</span><div class="alert-body"><strong>High Heart Rate</strong>Current: ${v.heart} bpm — consider resting.</div></div>`;
  if (v.temp  > 38)  html += `<div class="alert alert-warning"><span class="alert-icon">🌡️</span><div class="alert-body"><strong>Elevated Temperature</strong>Current: ${v.temp}°C — monitor closely.</div></div>`;
  if (v.oxy   < 94)  html += `<div class="alert alert-danger"><span class="alert-icon">🩸</span><div class="alert-body"><strong>Low Oxygen Saturation</strong>Current: ${v.oxy}% — seek medical advice.</div></div>`;
  if (!html) html = `<div class="alert alert-success"><span class="alert-icon">✅</span><div class="alert-body"><strong>All Vitals Normal</strong>No alerts at this time.</div></div>`;
  container.innerHTML = html;
}

/* ─── Health Form Submission ─── */
const healthForm = document.getElementById("healthForm");
if (healthForm) {
  healthForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = this.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Submitting…';

    const payload = {
      name:        document.getElementById("name")?.value || "",
      age:         Number(document.getElementById("age")?.value),
      temperature: Number(document.getElementById("temperature")?.value),
      cough:       document.getElementById("cough")?.value === "true",
      bp:          Number(document.getElementById("bp")?.value),
      symptoms:    document.getElementById("symptoms")?.value || "",
    };

    try {
      const result = await apiFetch("/api/health/submit-health", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const resultEl = document.getElementById("result");
      if (resultEl) {
        const level = result.riskLevel || "Unknown";
        const cls   = level === "High" ? "badge-danger" : level === "Medium" ? "badge-warning" : "badge-success";
        resultEl.innerHTML = `Risk Assessment: <span class="badge ${cls}">${level}</span>`;
      }

      showToast(`Health data submitted — Risk: ${result.riskLevel}`, "success");
      healthForm.reset();
    } catch (err) {
      showToast(err.message || "Submission failed", "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = "Submit Health Data";
    }
  });
}

/* ─── Alert History (static for now) ─── */
function renderAlertHistory() {
  const table = document.getElementById("alertHistoryBody");
  if (!table) return;
  const alerts = JSON.parse(localStorage.getItem("alertHistory") || "[]");
  if (!alerts.length) {
    table.innerHTML = `<tr><td colspan="4" class="text-center text-muted" style="padding:32px">No alert history</td></tr>`;
    return;
  }
  table.innerHTML = alerts.map(a => `
    <tr>
      <td>${a.time}</td>
      <td>${a.type}</td>
      <td>${riskBadge(a.severity)}</td>
      <td><span class="badge badge-info">${a.status}</span></td>
    </tr>`).join("");
}

/* ─── Mini Line Chart (Chart.js) ─── */
function initVitalsChart() {
  const canvas = document.getElementById("vitalsChart");
  if (!canvas || !window.Chart) return;

  const labels = ["10m ago", "8m ago", "6m ago", "4m ago", "2m ago", "Now"];
  const heartData = labels.map(() => Math.floor(Math.random() * 30) + 65);
  const oxyData   = labels.map(() => Math.floor(Math.random() * 6)  + 94);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Heart Rate (bpm)",
          data: heartData,
          borderColor: "#EF4444",
          backgroundColor: "rgba(239,68,68,0.08)",
          tension: 0.4, fill: true, pointRadius: 4,
          pointBackgroundColor: "#EF4444",
        },
        {
          label: "Oxygen (%)",
          data: oxyData,
          borderColor: "#2563EB",
          backgroundColor: "rgba(37,99,235,0.06)",
          tension: 0.4, fill: true, pointRadius: 4,
          pointBackgroundColor: "#2563EB",
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "top", labels: { usePointStyle: true, font: { size: 12 } } } },
      scales: {
        x: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } },
        y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

/* ─── Boot ─── */
document.addEventListener("DOMContentLoaded", function () {
  updateLiveVitals();
  setInterval(updateLiveVitals, 5000);
  renderAlertHistory();
  initVitalsChart();
});