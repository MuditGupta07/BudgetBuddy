function calculateTotals(transactions) {
    let totalExpenses = 0;
    let totalSalary = 0;
  
    transactions.forEach(tx => {
      totalSalary += tx.salary || 0;
      let expenseSum = 0;
      for (const key in tx.expenses) {
        expenseSum += tx.expenses[key] || 0;
      }
      if (tx.customExpenses) {
        tx.customExpenses.forEach(ce => {
          expenseSum += ce.amount || 0;
        });
      }
      totalExpenses += expenseSum;
    });
  
    return { totalExpenses, totalSalary };
  }
  
  function renderTransactions(transactions) {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
  
    transactions.forEach(tx => {
      const tr = document.createElement('tr');
  
      const dateTd = document.createElement('td');
      dateTd.textContent = tx.date;
      tr.appendChild(dateTd);
  
      const salaryTd = document.createElement('td');
      salaryTd.textContent = `₹${tx.salary.toFixed(2)}`;
      tr.appendChild(salaryTd);
  
      const expensesTd = document.createElement('td');
      const expenseDetails = [];
      for (const key in tx.expenses) {
        if (tx.expenses[key] > 0) {
          expenseDetails.push(`${key}: ₹${tx.expenses[key].toFixed(2)}`);
        }
      }
      expensesTd.textContent = expenseDetails.join(', ');
      tr.appendChild(expensesTd);
  
      const customExpenseTd = document.createElement('td');
      if (tx.customExpenses && Array.isArray(tx.customExpenses) && tx.customExpenses.length > 0) {
        customExpenseTd.textContent = tx.customExpenses.map(ce => `${ce.name}: ₹${ce.amount.toFixed(2)}`).join(', ');
      } else {
        customExpenseTd.textContent = '-';
      }
      tr.appendChild(customExpenseTd);
  
      const actionsTd = document.createElement('td');
      actionsTd.className = 'actions';
  
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      deleteBtn.title = 'Delete Transaction';
      deleteBtn.addEventListener('click', () => {
        deleteTransaction(tx.id);
      });
      actionsTd.appendChild(deleteBtn);
  
      const viewGraphLink = document.createElement('a');
      viewGraphLink.href = `../Summary/summary.html?id=${tx.id}`;
      viewGraphLink.title = 'View Graph';
      viewGraphLink.innerHTML = '<i class="fas fa-chart-bar"></i>';
      actionsTd.appendChild(viewGraphLink);
  
      tr.appendChild(actionsTd);
      tbody.appendChild(tr);
    });
  }
  
  function deleteTransaction(id) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(tx => tx.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateDisplay();
  }
  
  function updateDisplay() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    renderTransactions(transactions);
    const totals = calculateTotals(transactions);
    document.getElementById('totalExpenses').textContent = `₹${totals.totalExpenses.toFixed(2)}`;
    const leftover = totals.totalSalary - totals.totalExpenses;
    document.getElementById('leftoverAmount').textContent = `₹${leftover.toFixed(2)}`;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
  });