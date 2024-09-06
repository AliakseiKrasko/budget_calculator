// Получаем ссылки на элементы формы и элементы для отображения данных
const budgetForm = document.querySelector("#form");
const transactionType = document.querySelector("#type");
const transactionTitle = document.querySelector("#title");
const transactionValue = document.querySelector("#value");
const incomeList = document.querySelector("#incomes-list");
const expenseList = document.querySelector("#expenses-list");
const totalBudgetElement = document.querySelector("#budget");
const totalIncomeElement = document.querySelector("#total-income");
const totalExpenseElement = document.querySelector("#total-expense");
const expensePercentWrapper = document.querySelector("#expense-percents-wrapper");
const monthElement = document.querySelector("#month");
const yearElement = document.querySelector("#year");

// Массив для хранения всех записей бюджета
let budgetRecords = JSON.parse(localStorage.getItem('budgetRecords')) || [];

// Форматирование цен для отображения в валюте
const currencyFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
});

// Функция для вставки тестовых данных в форму
function insertRandomTestData() {
  const testData = [
    { type: "inc", title: "Фриланс", value: 1500 },
    { type: "inc", title: "Зарплата", value: 2000 },
    { type: "inc", title: "Кредит", value: 2000 },
    { type: "inc", title: "Продажи", value: 1000 },
    { type: "exp", title: "Продукты", value: 300 },
    { type: "exp", title: "Отдых", value: 200 },
    { type: "exp", title: "Транспорт", value: 200 },
    { type: "exp", title: "Квартира", value: 500 },
  ];

  const randomIndex = Math.floor(Math.random() * testData.length);
  const randomData = testData[randomIndex];
  transactionType.value = randomData.type;
  transactionTitle.value = randomData.title;
  transactionValue.value = randomData.value;
}

// Очищаем форму после добавления данных
function resetForm() {
  budgetForm.reset();
}

// Функция для расчета и обновления бюджета
function calculateAndUpdateBudget() {
  const totalIncome = budgetRecords
    .filter(record => record.type === "inc")
    .reduce((total, record) => total + record.value, 0);

  const totalExpense = budgetRecords
    .filter(record => record.type === "exp")
    .reduce((total, record) => total + record.value, 0);

  const totalBudget = totalIncome - totalExpense;
  const expensePercent = totalIncome > 0 ? Math.round((totalExpense * 100) / totalIncome) : 0;

  // Обновляем отображение бюджета, доходов и расходов
  totalBudgetElement.innerHTML = currencyFormatter.format(totalBudget);
  totalIncomeElement.innerHTML = `+ ${currencyFormatter.format(totalIncome)}`;
  totalExpenseElement.innerHTML = `- ${currencyFormatter.format(totalExpense)}`;

  // Обновляем проценты расходов
  expensePercentWrapper.innerHTML = expensePercent > 0 ? `<div class="header__value">${expensePercent}%</div>` : "";
  
  // Сохраняем данные в localStorage
  localStorage.setItem('budgetRecords', JSON.stringify(budgetRecords));
}

// Функция для отображения текущего месяца и года
function displayCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
    });

    const currentMonth = monthFormatter.format(now);
    monthElement.innerHTML = currentMonth;
    yearElement.innerHTML = year;
}

// Функция для отображения записей
function displayBudgetRecords() {
  incomeList.innerHTML = '';
  expenseList.innerHTML = '';

  // Сортируем записи по типу и добавляем их в соответствующие списки
  budgetRecords.forEach(record => {
    const html = `
      <li data-id="${record.id}" class="budget-list__item item item--${record.type === 'inc' ? 'income' : 'expense'}">
        <div class="item__title">${record.title}</div>
        <div class="item__right">
          <div class="item__amount">${record.type === 'inc' ? '+' : '-'} ${currencyFormatter.format(record.value)}</div>
          <button class="item__remove">
            <img src="./img/circle-${record.type === 'inc' ? 'green' : 'red'}.svg" alt="delete" />
          </button>
        </div>
      </li>
    `;
    if (record.type === "inc") {
      incomeList.insertAdjacentHTML("beforeend", html);
    } else {
      expenseList.insertAdjacentHTML("beforeend", html);
    }
  });
}

// Инициализация страницы
displayCurrentMonth();
insertRandomTestData();
displayBudgetRecords();
calculateAndUpdateBudget();

// Обработчик отправки формы
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Проверка корректности ввода
  if (transactionTitle.value.trim() === "") {
    transactionTitle.classList.add("form__input__error");
    return;
  } else {
    transactionTitle.classList.remove("form__input__error");
  }

  if (transactionValue.value.trim() === "" || +transactionValue.value <= 0) {
    transactionValue.classList.add("form__input__error");
    return;
  } else {
    transactionValue.classList.remove("form__input__error");
  }

  // Генерация уникального ID
  const recordId = budgetRecords.length > 0 ? budgetRecords[budgetRecords.length - 1].id + 1 : 1;

  // Создаем новую запись бюджета
  const newRecord = {
    id: recordId,
    type: transactionType.value,
    title: transactionTitle.value.trim(),
    value: +transactionValue.value,
  };

  // Добавляем запись в массив бюджета и обновляем отображение
  budgetRecords.push(newRecord);
  displayBudgetRecords();
  resetForm();
  insertRandomTestData();
  calculateAndUpdateBudget();
});

// Обработчик удаления записей
document.body.addEventListener("click", function (e) {
  if (e.target.closest("button.item__remove")) {
    const recordElement = e.target.closest("li.budget-list__item");
    const recordId = +recordElement.dataset.id;

    // Находим и удаляем запись по ID
    budgetRecords = budgetRecords.filter(record => record.id !== recordId);

    // Удаляем элемент из DOM и обновляем данные
    recordElement.remove();
    calculateAndUpdateBudget();
  }
});
