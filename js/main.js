// Получаем ссылки на элементы формы и элементы для отображения данных
const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomesList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");
const budgetElement = document.querySelector("#budget");
const totalIncomeElement = document.querySelector("#total-income");
const totalExpensesElement = document.querySelector("#total-expense");
const persentWrapper = document.querySelector("#expense-percents-wrapper");
const monthElement = document.querySelector("#month");
const yearElement = document.querySelector("#year");

// Массив для хранения всех записей бюджета
let budget = JSON.parse(localStorage.getItem('budget')) || [];

// Форматирование цен для отображения в валюте
const priceFormater = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
});

// Функция для вставки тестовых данных в форму
function insertTestData() {
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
  type.value = randomData.type;
  title.value = randomData.title;
  value.value = randomData.value;
}

// Очищаем форму после добавления данных
function clearForm() {
  form.reset();
}

// Функция для расчета и обновления бюджета
function calcBudget() {
  const totalIncome = budget
    .filter(record => record.type === "inc")
    .reduce((total, record) => total + record.value, 0);

  const totalExpense = budget
    .filter(record => record.type === "exp")
    .reduce((total, record) => total + record.value, 0);

  const totalBudget = totalIncome - totalExpense;
  const expensePercents = totalIncome > 0 ? Math.round((totalExpense * 100) / totalIncome) : 0;

  // Обновляем отображение бюджета, доходов и расходов
  budgetElement.innerHTML = priceFormater.format(totalBudget);
  totalIncomeElement.innerHTML = `+ ${priceFormater.format(totalIncome)}`;
  totalExpensesElement.innerHTML = `- ${priceFormater.format(totalExpense)}`;

  // Обновляем проценты расходов
  persentWrapper.innerHTML = expensePercents > 0 ? `<div class="header__value">${expensePercents}%</div>` : "";
  
  // Сохраняем данные в localStorage
  localStorage.setItem('budget', JSON.stringify(budget));
}

// Функция для отображения текущего месяца и года
function displayMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const timeFormater = new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
    });

    const month = timeFormater.format(now);
    monthElement.innerHTML = month;
    yearElement.innerHTML = year;
}

// Функция для отображения записей
function displayBudgetRecords() {
  incomesList.innerHTML = '';
  expensesList.innerHTML = '';

  // Отображаем все записи бюджета
  budget.forEach(record => {
    const html = `
      <li data-id="${record.id}" class="budget-list__item item item--${record.type === 'inc' ? 'income' : 'expense'}">
        <div class="item__title">${record.title}</div>
        <div class="item__right">
          <div class="item__amount">${record.type === 'inc' ? '+' : '-'} ${priceFormater.format(record.value)}</div>
          <button class="item__remove">
            <img src="./img/circle-${record.type === 'inc' ? 'green' : 'red'}.svg" alt="delete" />
          </button>
        </div>
      </li>
    `;
    if (record.type === "inc") {
      incomesList.insertAdjacentHTML("beforeend", html);
    } else {
      expensesList.insertAdjacentHTML("afterbegin", html);
    }
  });
}

// Инициализация страницы
displayMonth();
insertTestData(); // Вызов этой функции сразу после загрузки страницы
displayBudgetRecords();
calcBudget();

// Обработчик отправки формы
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Проверка корректности ввода
  if (title.value.trim() === "") {
    title.classList.add("form__input__error");
    return;
  } else {
    title.classList.remove("form__input__error");
  }

  if (value.value.trim() === "" || +value.value <= 0) {
    value.classList.add("form__input__error");
    return;
  } else {
    value.classList.remove("form__input__error");
  }

  // Генерация уникального ID
  const id = budget.length > 0 ? budget[budget.length - 1].id + 1 : 1;

  // Создаем новую запись бюджета
  const newRecord = {
    id: id,
    type: type.value,
    title: title.value.trim(),
    value: +value.value,
  };

  // Добавляем запись в массив бюджета и обновляем отображение
  budget.push(newRecord);
  displayBudgetRecords();
  clearForm();
  insertTestData(); // Вставляем тестовые данные после каждой новой записи
  calcBudget();
});

// Обработчик удаления записей
document.body.addEventListener("click", function (e) {
  if (e.target.closest("button.item__remove")) {
    const recordElement = e.target.closest("li.budget-list__item");
    const id = +recordElement.dataset.id;

    // Находим и удаляем запись по ID
    budget = budget.filter(record => record.id !== id);

    // Удаляем элемент из DOM и обновляем данные
    recordElement.remove();
    calcBudget();
  }
});
