
// ==========================================
// POKETCARE TRANSACTIONS PAGE
// Bootstrap Table + Hardcoded Data
// ==========================================

// CHECK LOGIN
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

// ==========================================
// 1. HARDCODED TRANSACTIONS
// ==========================================

// Same sample data as Dashboard
const defaultTransactions = [
    { id: 1, date: "2026-11-15", description: "Groceries", category: "Food", amount: 150, status: "Completed" },
    { id: 2, date: "2026-11-14", description: "Lunch & Dinner", category: "Food", amount: 120, status: "Completed" },
    { id: 3, date: "2026-11-13", description: "Clothing", category: "Shopping", amount: 100, status: "Completed" },
    { id: 4, date: "2026-11-12", description: "Textbooks", category: "Education", amount: 90, status: "Completed" },
    { id: 5, date: "2026-11-11", description: "Grab Transport", category: "Transport", amount: 75, status: "Completed" },
    { id: 6, date: "2026-11-10", description: "Petrol", category: "Transport", amount: 55, status: "Completed" },
    { id: 7, date: "2026-11-09", description: "Mobile Data", category: "Utilities", amount: 40, status: "Completed" },
    { id: 8, date: "2026-11-08", description: "Bus Fare", category: "Transport", amount: 20, status: "Completed" }
];

// Load saved transactions or use sample data
let transactions;

try {
    const saved = sessionStorage.getItem("poketcareTransactions");
    transactions = saved ? JSON.parse(saved) : [...defaultTransactions];

    if (!Array.isArray(transactions)) {
        transactions = [...defaultTransactions];
    }
} catch (error) {
    transactions = [...defaultTransactions];
}

// Save transaction changes for this browser tab
function saveTransactions() {
    sessionStorage.setItem(
        "poketcareTransactions",
        JSON.stringify(transactions)
    );
}

// ==========================================
// 2. FORMAT FUNCTIONS
// ==========================================

function formatRM(amount) {
    return "RM" + Number(amount).toFixed(2);
}

function formatDate(dateString) {
    const parts = dateString.split("-");
    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// ==========================================
// 3. UPDATE SUMMARY CARDS
// ==========================================

function updateSummary() {

    const totalExpenses = transactions.reduce(
        (sum, item) => sum + item.amount, 0
    );

    const highestExpense = transactions.length > 0
        ? Math.max(...transactions.map(item => item.amount))
        : 0;

    document.getElementById("totalExpenses").textContent =
        formatRM(totalExpenses);

    document.getElementById("totalTransactions").textContent =
        transactions.length;

    document.getElementById("highestExpense").textContent =
        formatRM(highestExpense);
}

// ==========================================
// 4. DISPLAY BOOTSTRAP TABLE
// ==========================================

function displayTransactions() {

    const tableBody = document.getElementById(
        "transactionTableBody"
    );

    const searchText = document.getElementById(
        "searchTransaction"
    ).value.toLowerCase();

    const selectedCategory = document.getElementById(
        "categoryFilter"
    ).value;

    const filtered = transactions.filter(function(item) {

        const matchSearch =
            item.description.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === "All" ||
            item.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    tableBody.innerHTML = "";

    if (filtered.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.className = "text-center text-muted py-4";
        cell.textContent = "No transactions found.";

        row.appendChild(cell);
        tableBody.appendChild(row);

    } else {

        filtered.forEach(function(item, index) {

            const row = document.createElement("tr");

            const values = [
                index + 1,
                formatDate(item.date),
                item.description,
                item.category,
                formatRM(item.amount)
            ];

            values.forEach(function(value, columnIndex) {

                const cell = document.createElement("td");
                cell.textContent = value;

                if (columnIndex === 4) {
                    cell.className = "transaction-amount";
                }

                row.appendChild(cell);
            });

            // Bootstrap status badge
            const statusCell = document.createElement("td");
            const badge = document.createElement("span");

            badge.className = "badge bg-success";
            badge.textContent = item.status;

            statusCell.appendChild(badge);
            row.appendChild(statusCell);

            // Delete button
            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.className =
                "btn btn-outline-danger btn-sm delete-btn";

            deleteButton.innerHTML =
                '<i class="bi bi-trash"></i> Delete';

            deleteButton.addEventListener("click", function() {
                deleteTransaction(item.id);
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    document.getElementById("recordCount").textContent =
        "Showing " + filtered.length +
        " of " + transactions.length + " transactions";
}

// ==========================================
// 5. SEARCH AND FILTER
// ==========================================

document.getElementById("searchTransaction")
    .addEventListener("input", displayTransactions);

document.getElementById("categoryFilter")
    .addEventListener("change", displayTransactions);

document.getElementById("resetFilter")
    .addEventListener("click", function() {

        document.getElementById("searchTransaction").value = "";
        document.getElementById("categoryFilter").value = "All";

        displayTransactions();
    });

// ==========================================
// 6. ADD TRANSACTION
// ==========================================

document.getElementById("addTransactionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const date = document.getElementById(
            "transactionDate"
        ).value;

        const description = document.getElementById(
            "transactionDescription"
        ).value.trim();

        const category = document.getElementById(
            "transactionCategory"
        ).value;

        const amount = Number(document.getElementById(
            "transactionAmount"
        ).value);

        if (!date || !description || !category ||
            !Number.isFinite(amount) || amount <= 0) {

            alert("Please complete all fields correctly.");
            return;
        }

        const newId = transactions.length > 0
            ? Math.max(...transactions.map(item => item.id)) + 1
            : 1;

        const newTransaction = {
            id: newId,
            date: date,
            description: description,
            category: category,
            amount: amount,
            status: "Completed"
        };

        transactions.unshift(newTransaction);

        saveTransactions();
        updateSummary();

        // Clear filters to show new transaction
        document.getElementById("searchTransaction").value = "";
        document.getElementById("categoryFilter").value = "All";

        displayTransactions();

        // Close Bootstrap modal
        const modalElement = document.getElementById(
            "addTransactionModal"
        );

        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }

        // Reset form
        document.getElementById("addTransactionForm").reset();

    });

// ==========================================
// 7. DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (confirmation) {

        transactions = transactions.filter(
            item => item.id !== id
        );

        saveTransactions();
        updateSummary();
        displayTransactions();
    }
}

// ==========================================
// 8. LOGOUT
// ==========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("poketcareTransactions");

        window.location.href = "index.html";
    });

// ==========================================
// 9. INITIALIZE PAGE
// ==========================================

updateSummary();
displayTransactions();
