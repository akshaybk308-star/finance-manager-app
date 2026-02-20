document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let expenses = JSON.parse(localStorage.getItem('ledgerLite_expenses')) || [];

    // --- DOM Elements ---
    const form = document.getElementById('expense-form');
    const transactionList = document.getElementById('transaction-list');
    const totalAmountEl = document.getElementById('total-amount');
    const transactionCountEl = document.getElementById('transaction-count');
    const emptyState = document.getElementById('empty-state');
    const dateInput = document.getElementById('date');
    const chartCtx = document.getElementById('expenseChart').getContext('2d');

    // Set default date to today
    dateInput.valueAsDate = new Date();

    // --- Chart Initialization ---
    let expenseChart = new Chart(chartCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
                    '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            }
        }
    });

    // --- Functions ---

    function saveExpenses() {
        localStorage.setItem('ledgerLite_expenses', JSON.stringify(expenses));
        updateUI();
    }

    function addExpense(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const note = document.getElementById('note').value;

        if (!amount || !category || !date) return;

        const expense = {
            id: Date.now(),
            amount,
            category,
            date,
            note
        };

        expenses.unshift(expense); // Add to beginning of array
        saveExpenses();
        form.reset();
        dateInput.valueAsDate = new Date(); // Reset date to today
    }

    function deleteExpense(id) {
        if(confirm('Are you sure you want to delete this expense?')) {
            expenses = expenses.filter(expense => expense.id !== id);
            saveExpenses();
        }
    }

    function formatCurrency(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function updateSummary() {
        // Calculate Total
        const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        totalAmountEl.textContent = formatCurrency(total);
        transactionCountEl.textContent = expenses.length;
    }

    function updateChart() {
        if (expenses.length === 0) {
             expenseChart.data.labels = ['No Data'];
             expenseChart.data.datasets[0].data = [1];
             expenseChart.data.datasets[0].backgroundColor = ['#e2e8f0'];
             expenseChart.update();
             return;
        }

        const categoryTotals = {};
        expenses.forEach(expense => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            } else {
                categoryTotals[expense.category] = expense.amount;
            }
        });

        expenseChart.data.labels = Object.keys(categoryTotals);
        expenseChart.data.datasets[0].data = Object.values(categoryTotals);
        expenseChart.data.datasets[0].backgroundColor = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
            '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'
        ];
        expenseChart.update();
    }

    function renderHistory() {
        transactionList.innerHTML = '';

        if (expenses.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        expenses.forEach(expense => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${formatDate(expense.date)}</td>
                <td><span class="badge ${expense.category.toLowerCase()}">${expense.category}</span></td>
                <td>${expense.note || '-'}</td>
                <td class="amount-cell">${formatCurrency(expense.amount)}</td>
                <td>
                    <button class="btn-delete" onclick="deleteExpenseHandler(${expense.id})">
                        &times;
                    </button>
                </td>
            `;
            transactionList.appendChild(tr);
        });
    }

    function updateUI() {
        updateSummary();
        renderHistory();
        updateChart();
    }

    // Expose delete handler to window so inline onclick works
    window.deleteExpenseHandler = (id) => {
        deleteExpense(id);
    };

    // --- Event Listeners ---
    form.addEventListener('submit', addExpense);

    // --- Initial Render ---
    updateUI();
});
