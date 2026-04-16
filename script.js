let expenses = [];
let editIndex = -1;

const form = document.getElementById("expense-form");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("search");

// AGGIUNTA / MODIFICA
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (amount <= 0) {
        alert("Importo non valido");
        return;
    }

    const expense = { desc, amount, category, date };

    if (editIndex === -1) {
        expenses.push(expense);
    } else {
        expenses[editIndex] = expense;
        editIndex = -1;
    }

    form.reset();
    render();

    changeHeaderBackground();
});

// RENDER
function render() {
    list.innerHTML = "";

    let total = 0;

    expenses.forEach((exp, index) => {
        total += exp.amount;

        const row = `
            <tr>
                <td>${exp.desc}</td>
                <td>€ ${exp.amount}</td>
                <td>${exp.category}</td>
                <td>${exp.date}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editExpense(${index})">Modifica</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Elimina</button>
                </td>
            </tr>
        `;

        list.innerHTML += row;
    });

    totalEl.textContent = "€ " + total;
    countEl.textContent = expenses.length;
}

// ELIMINA
function deleteExpense(index) {
    expenses.splice(index, 1);
    render();
}

// MODIFICA
function editExpense(index) {
    const exp = expenses[index];

    document.getElementById("description").value = exp.desc;
    document.getElementById("amount").value = exp.amount;
    document.getElementById("category").value = exp.category;
    document.getElementById("date").value = exp.date;

    editIndex = index;
}

// RICERCA
searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#expense-list tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
});


// aggiornamento immagine header
const header = document.querySelector("header");
const backgrounds = [
    "img/SFONDO_1.jpg",
    "img/SFONDO_2.jpg",
    "img/SFONDO_3.jpg"
];
header.style.backgroundImage = `url('${backgrounds[0]}')`;
let bgIndex = 0;

function changeHeaderBackground() {
    bgIndex++;
    if (bgIndex >= backgrounds.length) {
        bgIndex = 0;
    }

    header.style.backgroundImage = `url('${backgrounds[bgIndex]}')`;
}

