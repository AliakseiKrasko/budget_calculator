import * as view from './view.js';

// Массив для хранения всех записей бюджета
let budget = JSON.parse(localStorage.getItem('budget')) || [];
if (!Array.isArray(budget)) {
  budget = [];
}

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

    
  view.renderTestData(randomData);
     
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

 
  
  view.renderBudget(totalIncome,
    totalExpense,
    totalBudget,
    expensePercents);
}

// Функция для отображения текущего месяца и года
function displayMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const timeFormater = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
  });

  const month = timeFormater.format(now);
  
  view.renderManths(month, year);
}

// Функция для отображения записей
function displayBudgetRecords() {
  view.elements.incomesList.innerHTML = '';
  view.elements.expensesList.innerHTML = '';

  budget.forEach(record => {
    view.renderRecord(record);
  });
}

// Инициализация страницы
displayMonth();
insertTestData(); // Вызов этой функции сразу после загрузки страницы
displayBudgetRecords();
calcBudget();

// Обработчик отправки формы
view.elements.form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!view.checkEmptyFields()) return;

  const id = budget.length > 0 ? budget[budget.length - 1].id + 1 : 1;

  const newRecord = {
    id: id,
    type: view.elements.type.value,
    title: view.elements.title.value.trim(),
    value: +view.elements.value.value,
  };

  budget.push(newRecord);
  localStorage.setItem('budget', JSON.stringify(budget)); // Сохраняем бюджет
  displayBudgetRecords();
  view.clearForm();
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
    localStorage.setItem('budget', JSON.stringify(budget)); // Сохраняем изменения
    recordElement.remove();
    calcBudget();
  }
});
