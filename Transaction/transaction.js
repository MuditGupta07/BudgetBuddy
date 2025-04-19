const form = document.getElementById('transactionForm');
const customExpensesContainer = document.getElementById('customExpensesContainer');
const addCustomExpenseBtn = document.getElementById('addCustomExpenseBtn');

let customExpenseCount = 1;

addCustomExpenseBtn.addEventListener('click', () => {
  const newCustomExpenseDiv = document.createElement('div');
  newCustomExpenseDiv.className = 'grid';

  newCustomExpenseDiv.innerHTML = `
    <div>
      <label for="customExpenseName${customExpenseCount}">Expense Name</label>
      <input type="text" id="customExpenseName${customExpenseCount}" name="customExpenseName${customExpenseCount}" placeholder="e.g. Gym" />
    </div>
    <div>
      <label for="customExpenseAmount${customExpenseCount}">Amount</label>
      <input type="number" id="customExpenseAmount${customExpenseCount}" name="customExpenseAmount${customExpenseCount}" min="0" step="0.01" />
    </div>
  `;

  customExpensesContainer.appendChild(newCustomExpenseDiv);
  customExpenseCount++;
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const salary = parseFloat(form.salary.value) || 0;
  const expenses = {
    groceries: parseFloat(form.groceries.value) || 0,
    households: parseFloat(form.households.value) || 0,
    healthcare: parseFloat(form.healthcare.value) || 0,
    travelling: parseFloat(form.travelling.value) || 0,
    education: parseFloat(form.education.value) || 0,
  };

  const customExpenses = [];
  for (let i = 0; i < customExpenseCount; i++) {
    const nameInput = form[`customExpenseName${i}`];
    const amountInput = form[`customExpenseAmount${i}`];
    if (nameInput && amountInput) {
      const name = nameInput.value.trim();
      const amount = parseFloat(amountInput.value) || 0;
      if (name && amount > 0) {
        customExpenses.push({ name, amount });
      }
    }
  }

  const transactionDate = form.transactionDate.value;

  const transaction = {
    salary,
    expenses,
    customExpenses,
    date: transactionDate,
    id: Date.now(),
  };

  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  alert('Transaction added successfully!');
  form.reset();
  customExpensesContainer.innerHTML = `
    <div class="grid">
      <div>
        <label for="customExpenseName0">Expense Name</label>
        <input type="text" id="customExpenseName0" name="customExpenseName0" placeholder="e.g. Gym" />
      </div>
      <div>
        <label for="customExpenseAmount0">Amount</label>
        <input type="number" id="customExpenseAmount0" name="customExpenseAmount0" min="0" step="0.01" />
      </div>
    </div>
  `;
  customExpenseCount = 1;
});