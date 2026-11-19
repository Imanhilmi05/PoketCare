
// ==========================================
// POKETCARE STUDENT PROFILE
// Hardcoded Data + Bootstrap
// ==========================================

// CHECK LOGIN SESSION
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("index.html");
}

// ==========================================
// 1. HARDCODED STUDENT DATA
// ==========================================

const defaultProfile = {
    name: "Ahmad Danish",
    studentId: "2026123456",
    email: "danish@example.com",
    phone: "012-3456789",
    university: "Universiti Teknologi MARA",
    faculty: "Faculty of Information Science",
    programme: "Bachelor of Information Science",
    semester: "Semester 3",
    campus: "UiTM Puncak Perdana"
};

// ==========================================
// 2. LOAD SAVED PROFILE
// ==========================================

let profile;

try {
    const savedProfile = sessionStorage.getItem(
        "poketcareProfile"
    );

    profile = savedProfile
        ? { ...defaultProfile, ...JSON.parse(savedProfile) }
        : { ...defaultProfile };

} catch (error) {
    profile = { ...defaultProfile };
}

// ==========================================
// 3. DISPLAY PROFILE DATA
// ==========================================

function displayProfile() {

    document.getElementById("profileName").textContent =
        profile.name;

    document.getElementById("profileProgramme").textContent =
        profile.programme;

    document.getElementById("profileStudentId").textContent =
        profile.studentId;

    document.getElementById("detailName").textContent =
        profile.name;

    document.getElementById("detailStudentId").textContent =
        profile.studentId;

    document.getElementById("detailEmail").textContent =
        profile.email;

    document.getElementById("detailPhone").textContent =
        profile.phone;

    document.getElementById("detailUniversity").textContent =
        profile.university;

    document.getElementById("detailFaculty").textContent =
        profile.faculty;

    document.getElementById("detailProgramme").textContent =
        profile.programme;

    document.getElementById("detailSemester").textContent =
        profile.semester;

    document.getElementById("detailCampus").textContent =
        profile.campus;
}

// ==========================================
// 4. OPEN EDIT PROFILE MODAL
// ==========================================

document.getElementById("editProfileModal")
    .addEventListener("show.bs.modal", function() {

        document.getElementById("editName").value =
            profile.name;

        document.getElementById("editStudentId").value =
            profile.studentId;

        document.getElementById("editEmail").value =
            profile.email;

        document.getElementById("editPhone").value =
            profile.phone;

        document.getElementById("editUniversity").value =
            profile.university;

        document.getElementById("editFaculty").value =
            profile.faculty;

        document.getElementById("editProgramme").value =
            profile.programme;

        document.getElementById("editSemester").value =
            profile.semester;

        document.getElementById("editCampus").value =
            profile.campus;

    });

// ==========================================
// 5. SAVE PROFILE CHANGES
// ==========================================

document.getElementById("editProfileForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        profile = {
            name: document.getElementById("editName").value.trim(),
            studentId: document.getElementById("editStudentId").value.trim(),
            email: document.getElementById("editEmail").value.trim(),
            phone: document.getElementById("editPhone").value.trim(),
            university: document.getElementById("editUniversity").value.trim(),
            faculty: document.getElementById("editFaculty").value.trim(),
            programme: document.getElementById("editProgramme").value.trim(),
            semester: document.getElementById("editSemester").value.trim(),
            campus: document.getElementById("editCampus").value.trim()
        };

        sessionStorage.setItem(
            "poketcareProfile",
            JSON.stringify(profile)
        );

        displayProfile();

        const modalElement = document.getElementById(
            "editProfileModal"
        );

        const modal = bootstrap.Modal.getInstance(
            modalElement
        );

        if (modal) {
            modal.hide();
        }

    });

// ==========================================
// 6. HARDCODED FINANCIAL DATA
// ==========================================

const defaultBudgets = [
    { category: "Food", allocated: 350 },
    { category: "Transport", allocated: 200 },
    { category: "Shopping", allocated: 150 },
    { category: "Education", allocated: 200 },
    { category: "Utilities", allocated: 100 }
];

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
// 7. LOAD FINANCIAL DATA
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

function formatRM(amount) {
    return "RM" + Number(amount).toFixed(2);
}

// ==========================================
// 8. DISPLAY FINANCIAL OVERVIEW
// ==========================================

function displayFinancialOverview() {

    const totalBudget = budgets.reduce(
        (sum, item) => sum + Number(item.allocated), 0
    );

    const totalExpenses = transactions.reduce(
        (sum, item) => sum + Number(item.amount), 0
    );

    const remaining = totalBudget - totalExpenses;

    document.getElementById("profileBudget").textContent =
        formatRM(totalBudget);

    document.getElementById("profileExpenses").textContent =
        formatRM(totalExpenses);

    document.getElementById("profileRemaining").textContent =
        formatRM(remaining);

    const tableBody = document.getElementById(
        "profileFinancialTable"
    );

    tableBody.innerHTML = "";

    budgets.forEach(function(budget, index) {

        const spent = transactions
            .filter(item => item.category === budget.category)
            .reduce((sum, item) => sum + Number(item.amount), 0);

        const balance = budget.allocated - spent;

        const row = document.createElement("tr");

        const values = [
            index + 1,
            budget.category,
            formatRM(budget.allocated),
            formatRM(spent),
            formatRM(balance)
        ];

        values.forEach(function(value, columnIndex) {

            const cell = document.createElement("td");
            cell.textContent = value;

            if (columnIndex === 4) {
                cell.className = balance >= 0
                    ? "positive-amount"
                    : "negative-amount";
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);

    });
}

// ==========================================
// 9. LOGOUT
// ==========================================

document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");

        window.location.href = "index.html";
    });

// ==========================================
// 10. INITIALIZE PAGE
// ==========================================

displayProfile();
displayFinancialOverview();
