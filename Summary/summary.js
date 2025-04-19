function calculatePercentages(data) {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return Object.entries(data).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
    })).sort((a, b) => b.amount - a.amount);
  }
  
  function renderExpenseTable(data) {
    const tbody = document.getElementById('expenseDetailsTable');
    const expenses = calculatePercentages(data);
  
    tbody.innerHTML = expenses.map(expense => `
      <tr>
        <td>${expense.category}</td>
        <td>₹${expense.amount.toFixed(2)}</td>
        <td>${expense.percentage}%</td>
      </tr>
    `).join('');
  }
  
  function renderChart(data) {
    const ctx = document.getElementById('expensesChart').getContext('2d');
    const labels = Object.keys(data);
    const amounts = Object.values(data);
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses Amount',
          data: amounts,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  
    renderExpenseTable(data);
  }
  
  function aggregateExpenses(transactions) {
    const totals = {
      Groceries: 0,
      Households: 0,
      Healthcare: 0,
      Travelling: 0,
      Education: 0,
    };
  
    transactions.forEach(tx => {
      totals.Groceries += tx.expenses.groceries || 0;
      totals.Households += tx.expenses.households || 0;
      totals.Healthcare += tx.expenses.healthcare || 0;
      totals.Travelling += tx.expenses.travelling || 0;
      totals.Education += tx.expenses.education || 0;
  
      if (tx.customExpenses && Array.isArray(tx.customExpenses)) {
        tx.customExpenses.forEach(ce => {
          if (totals[ce.name]) {
            totals[ce.name] += ce.amount;
          } else {
            totals[ce.name] = ce.amount;
          }
        });
      }
    });
  
    return totals;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const aggregated = aggregateExpenses(transactions);
    renderChart(aggregated);
  });