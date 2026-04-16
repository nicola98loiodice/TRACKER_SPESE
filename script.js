const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const header = document.querySelector("header");

// immagini di sfondo 
const backgrounds = [
    "img/SFONDO_1.jpg",
    "img/SFONDO_2.jpg",
    "img/SFONDO_3.jpg"
];

let bgIndex = 0;

// caricamento dati 
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// prima imm per header prima che parta funzione 
header.style.backgroundImage = `url('${backgrounds[0]}')`;

// ---- CHART ----
const CATEGORY_COLORS = {
    "Casa":          "#38BDF8",
    "Cibo":          "#A78BFA",
    "Trasporti":     "#34D399",
    "Tempo libero":  "#FBBF24",
    "Salute":        "#F87171",
    "Altro":         "#94A3B8"
};

const CATEGORIES = ["Casa", "Cibo", "Trasporti", "Tempo libero", "Salute", "Altro"];

const ctx = document.getElementById("categoryChart").getContext("2d");

const categoryChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: CATEGORIES,
        datasets: [{
            label: "Totale (€)",
            data: new Array(CATEGORIES.length).fill(0),
            backgroundColor: CATEGORIES.map(c => CATEGORY_COLORS[c] + "CC"),
            borderColor:     CATEGORIES.map(c => CATEGORY_COLORS[c]),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` € ${ctx.parsed.y.toFixed(2)}`
                }
            }
        },
        scales: {
            x: {
                ticks: { color: "#E2E8F0" },
                grid:  { color: "#334155" }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#E2E8F0",
                    callback: val => "€ " + val
                },
                grid: { color: "#334155" }
            }
        }
    }
});

function updateChart() {
    const totals = CATEGORIES.map(cat =>
        expenses
            .filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
    );
    categoryChart.data.datasets[0].data = totals;
    categoryChart.update();
}
// fine chart

// salva i dati
function saveData() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// cambia bg header
function changeHeaderBackground() {
    bgIndex = (bgIndex + 1) % backgrounds.length;
    header.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
}

// aggiungi
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (!description || !category || !date || amount <= 0) {
        alert("Compila tutti i campi correttamente");
        return;
    }

    const newExpense = {
        description,
        amount,
        category,
        date
    };

    expenses.push(newExpense);

    saveData();
    renderExpenses();
    changeHeaderBackground();

    form.reset();
});

// render
function renderExpenses() {
    list.innerHTML = "";

    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;

        const row = `
            <tr>
                <td>${exp.description}</td>
                <td>€ ${exp.amount.toFixed(2)}</td>
                <td>${exp.category}</td>
                <td>${exp.date}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">
                        Elimina
                    </button>
                </td>
            </tr>
        `;

        list.innerHTML += row;
    });

    totalEl.textContent = "€ " + total.toFixed(2);
    countEl.textContent = expenses.length;

    updateChart();
}

// elimina
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveData();
    renderExpenses();
}

renderExpenses();