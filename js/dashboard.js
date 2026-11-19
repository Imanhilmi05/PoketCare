
// ==========================================
// POKETCARE DASHBOARD
// Hardcoded Sample Data - IMS566 Project
// ==========================================


// Check login session
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

// Display username
const username = sessionStorage.getItem("username") || "Admin";

document.getElementById("displayUsername").textContent =
    username.charAt(0).toUpperCase() + username.slice(1);


// ==========================================
// 1. HARDCODED FINANCIAL DATA
// ==========================================

const monthlyBudget = 1000;

// Sample transactions for November 2026
const transactions = [
    {
        id: 1,
        date: "15 Nov 2026",
        description: "Groceries",
        category: "Food",
        amount: 150,
        status: "Completed"
    },
    {
        id: 2,
        date: "14 Nov 2026",
        description: "Lunch & Dinner",
        category: "Food",
        amount: 120,
        status: "Completed"
    },
    {
        id: 3,
        date: "13 Nov 2026",
        description: "Clothing",
        category: "Shopping",
        amount: 100,
        status: "Completed"
    },
    {
        id: 4,
        date: "12 Nov 2026",
        description: "Textbooks",
        category: "Education",
        amount: 90,
        status: "Completed"
    },
    {
        id: 5,
        date: "11 Nov 2026",
        description: "Grab Transport",
        category: "Transport",
        amount: 75,
        status: "Completed"
    },
    {
        id: 6,
        date: "10 Nov 2026",
        description: "Petrol",
        category: "Transport",
        amount: 55,
        status: "Completed"
    },
    {
        id: 7,
        date: "09 Nov 2026",
        description: "Mobile Data",
        category: "Utilities",
        amount: 40,
        status: "Completed"
    },
    {
        id: 8,
        date: "08 Nov 2026",
        description: "Bus Fare",
        category: "Transport",
        amount: 20,
        status: "Completed"
    }
];


// ==========================================
// 2. CALCULATE FINANCIAL SUMMARY
// ==========================================

const totalExpenses = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
);

const remainingBalance = monthlyBudget - totalExpenses;

const totalTransactions = transactions.length;

const budgetPercentage =
    (totalExpenses / monthlyBudget) * 100;

// Format amount in RM
function formatRM(amount) {
    return "RM" + amount.toFixed(2);
}

// Display summary cards
document.getElementById("monthlyBudget").textContent =
    formatRM(monthlyBudget);

document.getElementById("totalExpenses").textContent =
    formatRM(totalExpenses);

document.getElementById("remainingBalance").textContent =
    formatRM(remainingBalance);

document.getElementById("totalTransactions").textContent =
    totalTransactions;


// ==========================================
// 3. BOOTSTRAP TRANSACTION TABLE
// ==========================================

const tableBody = document.getElementById(
    "transactionTableBody"
);

// Generate rows using hardcoded data
transactions.forEach(function(transaction) {

    const row = document.createElement("tr");

    const values = [
        transaction.id,
        transaction.date,
        transaction.description,
        transaction.category,
        formatRM(transaction.amount)
    ];

    values.forEach(function(value, index) {

        const cell = document.createElement("td");
        cell.textContent = value;

        if (index === 4) {
            cell.classList.add("amount-text");
        }

        row.appendChild(cell);
    });

    // Bootstrap status badge
    const statusCell = document.createElement("td");

    const badge = document.createElement("span");
    badge.className = "badge bg-success";
    badge.textContent = transaction.status;

    statusCell.appendChild(badge);
    row.appendChild(statusCell);

    tableBody.appendChild(row);

});


// ==========================================
// 4. BUDGET PROGRESS
// ==========================================

document.getElementById("budgetPercentage").textContent =
    budgetPercentage.toFixed(1) + "%";

const progressBar = document.getElementById("budgetProgress");

progressBar.style.width =
    Math.min(budgetPercentage, 100) + "%";

progressBar.setAttribute(
    "aria-valuenow",
    Math.min(budgetPercentage, 100)
);

const budgetAlert = document.getElementById("budgetAlert");

if (budgetPercentage >= 100) {

    budgetAlert.className = "alert alert-danger";
    budgetAlert.textContent =
        "Warning! You have exceeded your monthly budget.";

    progressBar.className = "progress-bar bg-danger";

} else if (budgetPercentage >= 80) {

    budgetAlert.className = "alert alert-warning";
    budgetAlert.textContent =
        "Warning! You are approaching your budget limit.";

    progressBar.className = "progress-bar bg-warning";

} else {

    budgetAlert.className = "alert alert-success";
    budgetAlert.textContent =
        "Great! Your spending is within your monthly budget.";

}


// ==========================================
// 5. EXPENSES BY CATEGORY
// ==========================================

const categoryTotals = {};

transactions.forEach(function(transaction) {

    if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] +=
        transaction.amount;

});

const categoryNames = Object.keys(categoryTotals);
const categoryAmounts = Object.values(categoryTotals);

const categoryColors = [
    "#236344",
    "#f0ad4e",
    "#5b9bd5",
    "#e57373",
    "#a78bca"
];

// Display category breakdown
const breakdownContainer = document.getElementById(
    "categoryBreakdown"
);

categoryNames.forEach(function(category, index) {

    const amount = categoryTotals[category];
    const percentage = (amount / totalExpenses) * 100;

    const item = document.createElement("div");
    item.className = "category-row";

    const info = document.createElement("div");
    info.className = "d-flex justify-content-between";

    const name = document.createElement("span");
    name.textContent = category;

    const value = document.createElement("strong");
    value.textContent = formatRM(amount);

    info.appendChild(name);
    info.appendChild(value);

    const progress = document.createElement("div");
    progress.className = "progress";

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.width = percentage + "%";
    bar.style.backgroundColor =
        categoryColors[index % categoryColors.length];

    progress.appendChild(bar);

    item.appendChild(info);
    item.appendChild(progress);

    breakdownContainer.appendChild(item);

});


// ==========================================
// 6. CHART.JS DOUGHNUT CHART
// ==========================================

const chartCanvas = document.getElementById("expenseChart");

if (typeof Chart !== "undefined") {

    new Chart(chartCanvas, {

        type: "doughnut",

        data: {
            labels: categoryNames,

            datasets: [{
                label: "Expenses (RM)",
                data: categoryAmounts,
                backgroundColor: categoryColors,
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ": " +
                                formatRM(context.parsed);
                        }
                    }
                }
            }
        }

    });

}


// ==========================================
// 7. LOGOUT FUNCTION
// ==========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");

        window.location.href = "index.html";

    });
