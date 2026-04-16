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

    saveData();          // salva
    renderExpenses();    // aggiorna UI
    changeHeaderBackground(); // cambia header

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
}

// elimina

function deleteExpense(index) {
    expenses.splice(index, 1);

    saveData();       //  aggiorna storage
    renderExpenses(); //  aggiorna UI
}


renderExpenses();