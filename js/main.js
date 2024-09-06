const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomesList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");

const budget = [];

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

  function getRandomInt (max) {
    return Math.floor(Math.random() * max);
  }

  const randomIndex = getRandomInt(testData.length);
  const randomData = testData[randomIndex];
  type.value = randomData.type;
  title.value = randomData.title;
  value.value = randomData.value;
}

function clearForm () {
    form.reset()
}

function calcBudget() {
    budget.reduce(function (total, element) {
        
    }, 0);
}

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
    value: parseFloat(value.value),
  };

  budget.push(record);
  console.log(budget);

  if (record.type === "inc") {
    const html = `<li id="${record.id}" class="budget-list__item item item--income">
            <div class="item__title">"${record.title}"</div>
            <div class="item__right">
            <div class="item__amount">+ "${record.value}"</div>
            <button class="item__remove">
            <img src="./img/circle-green.svg" alt="delete" />
            </button>
            </div>
        </li>`;
    incomesList.insertAdjacentHTML("beforeend", html);
  }

  if (record.type === "exp") {
    const html = `<li data-id="${record.id}"                class="budget-list__item item item--expense">
            <div class="item__title">"${record.title}"</div>
            <div class="item__right">
            <div class="item__amount">- "${record.value}"</div>
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

document.body.addEventListener('click', function(e) {
    if (e.target.closest('button.item__remove')) {
        const recordElement = e.target.closest('li.budget-list__item');
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

