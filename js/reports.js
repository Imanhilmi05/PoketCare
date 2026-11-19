
// ==========================================
// POKETCARE REPORTS & ANALYTICS
// Hardcoded Data + Bootstrap + Chart.js
// ==========================================

// CHECK LOGIN SESSION
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

// ==========================================
// 1. HARDCODED SAMPLE DATA
// ==========================================

const defaultBudgets = [
    { category: "Food", allocated: 350 },
    { category: "Transport", allocated: 200 },
    { category: "Shopping", allocated: 150 },
    { category: "Education", allocated: 200 },
    { category: "Utilities", allocated: 100 }
];

const defaultTransactions = [
    { id: 1, date: "2026-11-15", description: "Groceries", category: "Food", amount: 150 },
    { id: 2, date: "2026-11-14", description: "Lunch & Dinner", category: "Food", amount: 120 },
    { id: 3, date: "2026-11-13", description: "Clothing", category: "Shopping", amount: 100 },
    { id: 4, date: "2026-11-12", description: "Textbooks", category: "Education", amount: 90 },
    { id: 5, date: "2026-11-11", description: "Grab Transport", category: "Transport", amount: 75 },
    { id: 6, date: "2026-11-10", description: "Petrol", category: "Transport", amount: 55 },
    { id: 7, date: "2026-11-09", description: "Mobile Data", category: "Utilities", amount: 40 },
    { id: 8, date: "2026-11-08", description: "Bus Fare", category: "Transport", amount: 20 }
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

const budgets = loadArray(
    "poketcareBudgets",
    defaultBudgets
);

const transactions = loadArray(
    "poketcareTransactions",
    defaultTransactions
);

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

function formatRM(amount) {
    return "RM" + Number(amount).toFixed(2);
}

function getCategorySpent(category) {

    return transactions
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + Number(item.amount), 0);
}

function getCategoryCount(category) {

    return transactions.filter(
        item => item.category === category
    ).length;
}

function getStatus(percentage) {

    if (percentage > 100) {
        return {
            label: "Over Budget",
            badge: "bg-danger"
        };
    }

    if (percentage >= 80) {
        return {
            label: "Near Limit",
            badge: "bg-warning text-dark"
        };
    }

    return {
        label: "On Track",
        badge: "bg-success"
    };
}

// ==========================================
// 4. CALCULATE FINANCIAL SUMMARY
// ==========================================

const totalBudget = budgets.reduce(
    (sum, item) => sum + Number(item.allocated), 0
);

const totalExpenses = transactions.reduce(
    (sum, item) => sum + Number(item.amount), 0
);

const remainingBalance = totalBudget - totalExpenses;

const budgetUsage = totalBudget > 0
    ? (totalExpenses / totalBudget) * 100
    : 0;

// DISPLAY SUMMARY CARDS
document.getElementById("totalBudget").textContent =
    formatRM(totalBudget);

document.getElementById("totalExpenses").textContent =
    formatRM(totalExpenses);

document.getElementById("remainingBalance").textContent =
    formatRM(remainingBalance);

document.getElementById("budgetUsage").textContent =
    budgetUsage.toFixed(1) + "%";

// ==========================================
// 5. CATEGORY REPORT TABLE
// ==========================================

const reportTableBody = document.getElementById(
    "reportTableBody"
);

budgets.forEach(function(budget, index) {

    const spent = getCategorySpent(budget.category);
    const count = getCategoryCount(budget.category);
    const remaining = budget.allocated - spent;

    const percentage = budget.allocated > 0
        ? (spent / budget.allocated) * 100
        : 0;

    const status = getStatus(percentage);

    const row = document.createElement("tr");

    const values = [
        index + 1,
        budget.category,
        count,
        formatRM(spent),
        formatRM(budget.allocated),
        formatRM(remaining),
        percentage.toFixed(1) + "%"
    ];

    values.forEach(function(value, columnIndex) {

        const cell = document.createElement("td");
        cell.textContent = value;

        if (columnIndex === 3) {
            cell.className = "report-amount";
        }

        if (columnIndex === 5 && remaining < 0) {
            cell.className = "report-negative";
        }

        row.appendChild(cell);
    });

    // STATUS BADGE
    const statusCell = document.createElement("td");

    const badge = document.createElement("span");
    badge.className = "badge " + status.badge;
    badge.textContent = status.label;

    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    reportTableBody.appendChild(row);

});

// TABLE FOOTER
document.getElementById("tableTotalSpent").textContent =
    formatRM(totalExpenses);

document.getElementById("tableTotalBudget").textContent =
    formatRM(totalBudget);

document.getElementById("tableRemaining").textContent =
    formatRM(remainingBalance);

document.getElementById("tableUsage").textContent =
    budgetUsage.toFixed(1) + "%";

// ==========================================
// 6. SPENDING BY DATE - BAR CHART
// ==========================================

const dateTotals = {};

transactions.forEach(function(item) {

    if (!dateTotals[item.date]) {
        dateTotals[item.date] = 0;
    }

    dateTotals[item.date] += Number(item.amount);

});

const sortedDates = Object.keys(dateTotals).sort();

const dateLabels = sortedDates.map(function(date) {

    const parts = date.split("-");

    return parts[2] + "/" + parts[1];
});

const dateAmounts = sortedDates.map(
    date => dateTotals[date]
);

// ==========================================
// 7. EXPENSES BY CATEGORY
// ==========================================

const categoryNames = budgets.map(
    item => item.category
);

const categoryAmounts = budgets.map(
    item => getCategorySpent(item.category)
);

const chartColors = [
    "#236344",
    "#5b9bd5",
    "#f0ad4e",
    "#a78bca",
    "#e57373"
];

// ==========================================
// 8. CHART.JS VISUALIZATIONS
// ==========================================

if (typeof Chart !== "undefined") {

    // BAR CHART
    new Chart(document.getElementById("spendingChart"), {

        type: "bar",

        data: {
            labels: dateLabels,

            datasets: [{
                label: "Daily Expenses (RM)",
                data: dateAmounts,
                backgroundColor: "#236344",
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Amount (RM)"
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: "Date (November 2026)"
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                }
            }
        }

    });

    // DOUGHNUT CHART
    new Chart(document.getElementById("categoryChart"), {

        type: "doughnut",

        data: {
            labels: categoryNames,

            datasets: [{
                label: "Expenses (RM)",
                data: categoryAmounts,
                backgroundColor: chartColors,
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }

    });

}

// ==========================================
// 9. FINANCIAL INSIGHTS
// ==========================================

const categorySummary = budgets.map(function(budget) {

    return {
        category: budget.category,
        spent: getCategorySpent(budget.category)
    };
});

categorySummary.sort((a, b) => b.spent - a.spent);

const highestCategory = categorySummary[0];

document.getElementById("highestCategory").textContent =
    highestCategory && highestCategory.spent > 0
        ? highestCategory.category + " has the highest spending at " +
          formatRM(highestCategory.spent) + "."
        : "No expenses recorded.";

const budgetStatus = document.getElementById(
    "budgetStatus"
);

if (budgetUsage > 100) {

    budgetStatus.textContent =
        "Your total expenses have exceeded your monthly budget.";

} else if (budgetUsage >= 80) {

    budgetStatus.textContent =
        "You are approaching your monthly budget limit.";

} else {

    budgetStatus.textContent =
        "Your spending is within the allocated monthly budget.";

}

document.getElementById("transactionInsight").textContent =
    "A total of " + transactions.length +
    " transactions have been recorded.";

// ==========================================
// 10. DOWNLOAD CSV REPORT
// ==========================================

document.getElementById("downloadReport")
    .addEventListener("click", function() {

        const csvRows = [
            [
                "Category",
                "Transactions",
                "Total Spent (RM)",
                "Budget (RM)",
                "Remaining (RM)",
                "Usage (%)"
            ]
        ];

        budgets.forEach(function(budget) {

            const spent = getCategorySpent(budget.category);
            const remaining = budget.allocated - spent;

            const usage = budget.allocated > 0
                ? (spent / budget.allocated) * 100
                : 0;

            csvRows.push([
                budget.category,
                getCategoryCount(budget.category),
                spent.toFixed(2),
                budget.allocated.toFixed(2),
                remaining.toFixed(2),
                usage.toFixed(1)
            ]);

        });

        csvRows.push([
            "Grand Total",
            transactions.length,
            totalExpenses.toFixed(2),
            totalBudget.toFixed(2),
            remainingBalance.toFixed(2),
            budgetUsage.toFixed(1)
        ]);

        const csvContent = csvRows
            .map(row => row.join(","))
            .join("\r\n");

        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "PoketCare_Report_November_2026.csv";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    });

// ==========================================
// 11. LOGOUT
// ==========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("poketcareTransactions");
        sessionStorage.removeItem("poketcareBudgets");

        window.location.href = "index.html";

    });
