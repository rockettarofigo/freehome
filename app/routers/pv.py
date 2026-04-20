const grid = document.getElementById("grid");

/* =========================
   UTILS
========================= */
function clearGrid() {
    grid.innerHTML = "";
}

function getLatest(results) {
    if (!results || results.length === 0) return null;
    return results[results.length - 1];
}

/* =========================
   BUILD DATA
========================= */
function buildPvData(record) {
    return [
        { label: "active_power", value: record.active_power, unit: "kW" },
        { label: "daily_kwh", value: record.daily_kwh, unit: "kWh" },
        { label: "soc_percent", value: record.soc_percent, unit: "%" },
        { label: "irradiance", value: record.irradiance, unit: "W/m²" }
    ];
}

/* =========================
   CHART GENERICO
========================= */
function renderChart(canvasId, labels, values, label) {

    const ctx = document.getElementById(canvasId);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                tension: 0.35,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: { display: false }
            },

            scales: {
                x: {
                    ticks: {
                        display: true,
                        autoSkip: true,
                        maxTicksLimit: 8,
                        maxRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: label === "soc_percent" ? 100 : undefined,
                    ticks: {
                        callback: function(value) {
                            return label === "soc_percent" ? value + "%" : value;
                        }
                    }
                }
            }
        }
    });
}

/* =========================
   RENDER DASHBOARD
========================= */
function renderPv(data, results) {

    const labels = results.map(r => {
        const d = new Date(r.date);
        return d.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
        });
    });

    data.forEach(item => {

        const card = document.createElement("div");
        card.className = "card wide";

        const canvasId = "chart_" + item.label;

        card.innerHTML = `
            <div class="left">
                <div class="label">${item.label}</div>
                <div class="value">${item.value}</div>
                <div class="unit">${item.unit}</div>
            </div>

            <div class="divider"></div>

            <canvas id="${canvasId}"></canvas>
        `;

        grid.appendChild(card);

        // 👉 FIX valori (numeri veri + null safe)
        const values = results.map(r => {
            let v = r[item.label];

            if (v === null || v === undefined) return 0;

            return Number(v);
        });

        // 👉 DEBUG solo SOC
        if (item.label === "soc_percent") {
            console.log("SOC VALUES:", values);
        }

        renderChart(canvasId, labels, values, item.label);
    });
}

/* =========================
   FETCH PV
========================= */
async function fetchPvData() {

    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!start || !end) {
        alert("Inserisci entrambe le date");
        return;
    }

    try {
        clearGrid();

        const pvRes = await fetch('http://192.168.0.8:8001/pull/fetch/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                start: start.replace("T", " ") + ":00",
                end: end.replace("T", " ") + ":00"
            })
        });

        const pvJson = await pvRes.json();

        if (!pvRes.ok) {
            alert("Errore backend PV");
            return;
        }

        const latest = getLatest(pvJson.results);

        if (!latest) {
            alert("Nessun dato disponibile");
            return;
        }

        const pvData = buildPvData(latest);

        renderPv(pvData, pvJson.results);

    } catch (err) {
        console.error(err);
        alert("Errore rete / CORS");
    }
}