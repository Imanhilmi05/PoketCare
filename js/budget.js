
// ==========================================
// POKETCARE BUDGET MANAGEMENT
// Hardcoded Data + Bootstrap Components
// ==========================================

// CHECK LOGIN SESSION
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

// ==========================================
// 1. HARDCODED BUDGET DATA
// ==========================================

const defaultBudgets = [
    { category: "Food", allocated: 350 },
    { category: "Transport", allocated: 200 },
    { category: "Shopping", allocated: 150 },
    { category: "Education", allocated: 200 },
    { category: "Utilities", allocated: 100 }
];

// Same default transactions as Page 3
const defaultTransactions = [
    { category: "Food", amount: 150 },
    { category: "Food", amount: 120 },
    { category: "Shopping", amount: 100 },
    { category: "Education", amount: 90 },
    { category: "Transport", amount: 75 },
    { category: "Transport", amount: 55 },
    { category: "Utilities", amount: 40 },
    { category: "Transport", amount: 20 }
];

// ==========================================
// 2. LOAD SAVED DATA
// ==========================================

function loadArray(key, fallback) {
    try {
        const saved = sessionStorage.getItem(key);

        if (!saved) {
            return fallback.map(item => ({ ...item }));
        }

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : fallback.map(item => ({ ...item }));

    } catch (error) {
        return fallback.map(item => ({ ...item }));
    }
}

let budgets = loadArray(
    "poketcareBudgets",
    defaultBudgets
);

let transactions = loadArray(
    "poketcareTransactions",
    defaultTransactions
);

// ==========================================
// 3. FORMAT AMOUNT
// ==========================================

function formatRM(amount) {
    return "RM" + Number(amount).toFixed(2);
}

// ==========================================
// 4. CALCULATE CATEGORY EXPENSES
// ==========================================

function getSpent(category) {

    return transactions
        .filter(item => item.category === category)
        .reduce((total, item) => total + Number(item.amount), 0);
}

// ==========================================
// 5. GET STATUS
// ==========================================

function getBudgetStatus(percentage) {

    if (percentage > 100) {
        return {
            label: "Over Budget",
            badge: "bg-danger",
            progress: "bg-danger"
        };
    }

    if (percentage >= 80) {
        return {
            label: "Near Limit",
            badge: "bg-warning text-dark",
            progress: "bg-warning"
        };
    }

    return {
        label: "On Track",
        badge: "bg-success",
        progress: "bg-success"
    };
}

// ==========================================
// 6. UPDATE BUDGET PAGE
// ==========================================

function updateBudgetPage() {

    const totalBudget = budgets.reduce(
        (sum, item) => sum + Number(item.allocated), 0
    );

    const totalSpent = transactions.reduce(
        (sum, item) => sum + Number(item.amount), 0
    );

    const remaining = totalBudget - totalSpent;

    const overallPercentage = totalBudget > 0
        ? (totalSpent / totalBudget) * 100
        : 0;

    // SUMMARY CARDS
    document.getElementById("totalBudget").textContent =
        formatRM(totalBudget);

    document.getElementById("totalSpent").textContent =
        formatRM(totalSpent);

    document.getElementById("remainingBudget").textContent =
        formatRM(remaining);

    // OVERALL PROGRESS
    document.getElementById("overallPercentage").textContent =
        overallPercentage.toFixed(1) + "%";

    const overallProgress = document.getElementById(
        "overallProgress"
    );

    overallProgress.style.width =
        Math.min(overallPercentage, 100) + "%";

    overallProgress.setAttribute(
        "aria-valuenow",
        Math.min(overallPercentage, 100)
    );

    const overallStatus = getBudgetStatus(
        overallPercentage
    );

    overallProgress.className =
        "progress-bar " + overallStatus.progress;

    // ALERT MESSAGE
    const alertBox = document.getElementById("budgetAlert");

    if (overallPercentage > 100) {

        alertBox.className = "alert alert-danger mb-0";
        alertBox.textContent =
            "Warning! You have exceeded your monthly budget.";

    } else if (overallPercentage >= 80) {

        alertBox.className = "alert alert-warning mb-0";
        alertBox.textContent =
            "Be careful! You are approaching your budget limit.";

    } else {

        alertBox.className = "alert alert-success mb-0";
        alertBox.textContent =
            "Great! Your spending is within your monthly budget.";

    }

    // CATEGORY CARDS AND TABLE
    const categoryContainer = document.getElementById(
        "categoryCards"
    );

    const tableBody = document.getElementById(
        "budgetTableBody"
    );

    categoryContainer.innerHTML = "";
    tableBody.innerHTML = "";

    budgets.forEach(function(budget, index) {

        const spent = getSpent(budget.category);

        const remainingAmount =
            budget.allocated - spent;

        const percentage = budget.allocated > 0
            ? (spent / budget.allocated) * 100
            : 0;

        const status = getBudgetStatus(percentage);

        // CATEGORY CARD
        const column = document.createElement("div");
        column.className = "col-md-6 col-xl-4";

        const card = document.createElement("div");
        card.className = "category-budget-card";

        const title = document.createElement("h6");
        title.textContent = budget.category;

        const amountText = document.createElement("p");
        amountText.className = "mb-2 text-muted";
        amountText.textContent =
            formatRM(spent) + " spent of " +
            formatRM(budget.allocated);

        const percentageText = document.createElement("strong");
        percentageText.textContent =
            percentage.toFixed(1) + "% used";

        const progress = document.createElement("div");
        progress.className = "progress";

        const bar = document.createElement("div");
        bar.className = "progress-bar " + status.progress;
        bar.style.width = Math.min(percentage, 100) + "%";

        progress.appendChild(bar);

        const badge = document.createElement("span");
        badge.className =
            "badge mt-3 " + status.badge;
        badge.textContent = status.label;

        card.appendChild(title);
        card.appendChild(amountText);
        card.appendChild(percentageText);
        card.appendChild(progress);
        card.appendChild(badge);

        column.appendChild(card);
        categoryContainer.appendChild(column);

        // BOOTSTRAP TABLE ROW
        const row = document.createElement("tr");

        const values = [
            index + 1,
            budget.category,
            formatRM(budget.allocated),
            formatRM(spent),
            formatRM(remainingAmount),
            percentage.toFixed(1) + "%"
        ];

        values.forEach(function(value, columnIndex) {

            const cell = document.createElement("td");
            cell.textContent = value;

            if (columnIndex === 4) {
                cell.className = remainingAmount >= 0
                    ? "remaining-positive"
                    : "remaining-negative";
            }

            row.appendChild(cell);
        });

        // STATUS BADGE
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");
        statusBadge.className = "badge " + status.badge;
        statusBadge.textContent = status.label;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // EDIT BUTTON
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.className =
            "btn btn-outline-success btn-sm edit-budget-btn";

        editButton.innerHTML =
            '<i class="bi bi-pencil-square"></i> Edit';

        editButton.addEventListener("click", function() {
            openEditModal(budget.category);
        });

        actionCell.appendChild(editButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}

// ==========================================
// 7. OPEN EDIT MODAL
// ==========================================

function openEditModal(category) {

    const budget = budgets.find(
        item => item.category === category
    );

    if (!budget) return;

    document.getElementById("editCategory").value =
        budget.category;

    document.getElementById("editAmount").value =
        budget.allocated;

    const modalElement = document.getElementById(
        "editBudgetModal"
    );

    const modal = bootstrap.Modal.getOrCreateInstance(
        modalElement
    );

    modal.show();
}

// ==========================================
// 8. SAVE EDITED BUDGET
// ==========================================

document.getElementById("editBudgetForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const category = document.getElementById(
            "editCategory"
        ).value;

        const newAmount = Number(document.getElementById(
            "editAmount"
        ).value);

        if (!Number.isFinite(newAmount) || newAmount <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }

        const budget = budgets.find(
            item => item.category === category
        );

        if (budget) {
            budget.allocated = newAmount;
        }

        // SAVE UPDATED BUDGET
        sessionStorage.setItem(
            "poketcareBudgets",
            JSON.stringify(budgets)
        );

        updateBudgetPage();

        // CLOSE MODAL
        const modalElement = document.getElementById(
            "editBudgetModal"
        );

        const modal = bootstrap.Modal.getInstance(
            modalElement
        );

        if (modal) {
            modal.hide();
        }

    });

// ==========================================
// 9. LOGOUT
// ==========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("poketcareTransactions");
        sessionStorage.removeItem("poketcareBudgets");

        window.location.href = "index.html";
    });

// ==========================================
// 10. INITIALIZE PAGE
// ==========================================

updateBudgetPage();
