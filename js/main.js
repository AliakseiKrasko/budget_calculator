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


const budget = [];

const priceFormater = new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
})

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

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const randomIndex = getRandomInt(testData.length);
  const randomData = testData[randomIndex];
  type.value = randomData.type;
  title.value = randomData.title;
  value.value = randomData.value;
}

function clearForm() {
  form.reset();
}

function calcBudget() {
  const totalIncome = budget.reduce(function (total, element) {
    if (element.type === "inc") {
      return total + element.value;
    } else {
      return total;
    }
  }, 0);

  const totalExpense = budget.reduce(function (total, element) {
    if (element.type === "exp") {
      return total + element.value;
    } else {
      return total;
    }
  }, 0);

  const totalBudget = totalIncome - totalExpense;
  let expensePercents = 0;
  if (totalIncome > 0) {
    expensePercents = Math.round((totalExpense * 100) / totalIncome);
  }


  budgetElement.innerHTML = priceFormater.format(totalBudget);
  totalIncomeElement.innerHTML = '+ ' + priceFormater.format(totalIncome);
  totalExpensesElement.innerHTML = '- ' + priceFormater.format(totalExpense);

  // Обновляем проценты, даже если они равны 0
  if (expensePercents !== null && expensePercents !== undefined) {
    const html = `<div class="header__value" id="budget">${expensePercents}%</div>`;
    persentWrapper.innerHTML = html;
  } else {
    persentWrapper.innerHTML = "";
  }
}

function displayMonth() {
    const now = new Date();
    const year = now.getFullYear();
    
    const timeFormater = new Intl.DateTimeFormat('ru-Ru', {
        month: 'long',

    });
    const month = timeFormater.format(now);
    monthElement.innerHTML = month;
    yearElement.innerHTML = year;
    
}

displayMonth();
insertTestData();
calcBudget();

form.addEventListener("submit", (e) => {
  e.preventDefault();

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

  let id = 1;
  if (budget.length > 0) {
    id = budget[budget.length - 1].id + 1;
  }

  const record = {
    id: id,
    type: type.value,
    title: title.value.trim(),
    value: +value.value,
  };

  budget.push(record);

  if (record.type === "inc") {
    const html = `<li data-id="${record.id}" class="budget-list__item item item--income">
            <div class="item__title">${record.title}</div>
            <div class="item__right">
            <div class="item__amount">+ ${priceFormater.format(record.value)}</div>
            <button class="item__remove">
            <img src="./img/circle-green.svg" alt="delete" />
            </button>
            </div>
        </li>`;
    incomesList.insertAdjacentHTML("beforeend", html);
  }

  if (record.type === "exp") {
    const html = `<li data-id="${record.id}" class="budget-list__item item item--expense">
            <div class="item__title">${record.title}</div>
            <div class="item__right">
            <div class="item__amount">- ${priceFormater.format(record.value)}</div>
            <button class="item__remove">
            <img src="./img/circle-red.svg" alt="delete" />
            </button>
            </div>
          </li>`;
    expensesList.insertAdjacentHTML("afterbegin", html);
  }

  clearForm();
  insertTestData();
  calcBudget();
});

document.body.addEventListener("click", function (e) {
  if (e.target.closest("button.item__remove")) {
    const recordElement = e.target.closest("li.budget-list__item");
    const id = +recordElement.dataset.id;

    // Поиск индекса элемента
    const index = budget.findIndex(function (element) {
      return id === element.id;
    });

    // Проверка, что элемент найден
    if (index !== -1) {
      budget.splice(index, 1); // Удаление элемента
    }

    recordElement.remove(); // Удаление элемента

    calcBudget();
  }
});
