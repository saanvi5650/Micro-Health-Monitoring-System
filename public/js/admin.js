/* ============================================================
   admin.js  — admin dashboard, patients table, charts
   ============================================================ */

requireAuth("admin");

/* ─── Load patient table ─── */
async function loadPatientTable() {
  const tbody = document.getElementById("tableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:32px"><span class="spinner"></span></td></tr>`;

  try {
    const data = await apiFetch("/api/health/reports");

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted" style="padding:32px">No records found</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(u => `
      <tr>
        <td><strong>${u.name || "—"}</strong></td>
        <td class="font-mono">${u.temperature ? u.temperature + "°C" : "—"}</td>
        <td class="font-mono">${u.bp || "—"}</td>
        <td>${riskBadge(u.riskLevel)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="viewPatient('${u._id || u.id}')">
            View Details
          </button>
        </td>
      </tr>`).join("");

    /* update stat cards */
    const total    = data.length;
    const critical = data.filter(d => d.riskLevel === "High").length;
    const medium   = data.filter(d => d.riskLevel === "Medium").length;

    setStatCard("statTotal",    total);
    setStatCard("statAlerts",   critical);
    setStatCard("statCritical", medium);

    initRiskPieChart(total - critical - medium, medium, critical);
  } catch (err) {
    showToast("Failed to load patient data", "error");
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger" style="padding:32px">Error loading data</td></tr>`;
  }
}

function setStatCard(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function viewPatient(id) {
  if (id) localStorage.setItem("viewPatientId", id);
  window.location.href = "patient-details.html";
}

/* ─── Risk Distribution Pie Chart ─── */
function initRiskPieChart(low, medium, high) {
  const canvas = document.getElementById("riskChart");
  if (!canvas || !window.Chart) return;

  if (canvas._chartInstance) canvas._chartInstance.destroy();

  canvas._chartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Low Risk", "Medium Risk", "High Risk"],
      datasets: [{
        data: [low, medium, high],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: { position: "bottom", labels: { usePointStyle: true, font: { size: 12 }, padding: 16 } },
      },
    },
  });
}

/* ─── Patient Trend Bar Chart ─── */
function initTrendChart() {
  const canvas = document.getElementById("trendChart");
  if (!canvas || !window.Chart) return;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const admitted  = days.map(() => Math.floor(Math.random() * 10) + 5);
  const recovered = days.map(() => Math.floor(Math.random() * 8)  + 3);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "New Cases",
          data: admitted,
          backgroundColor: "rgba(37,99,235,0.75)",
          borderRadius: 6, borderSkipped: false,
        },
        {
          label: "Recovered",
          data: recovered,
          backgroundColor: "rgba(16,185,129,0.65)",
          borderRadius: 6, borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "top", labels: { usePointStyle: true, font: { size: 12 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

/* ─── Patient Search ─── */
function initSearch() {
  const input = document.getElementById("patientSearch");
  if (!input) return;
  input.addEventListener("input", function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  });
}

/* ─── Boot ─── */
document.addEventListener("DOMContentLoaded", function () {
  loadPatientTable();
  initTrendChart();
  initSearch();
});