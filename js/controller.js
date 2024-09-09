import * as model from './model.js';
import * as view from './view.js';

init();

// Функция для отображения всех записей бюджета
function displayBudgetRecords() {
  view.elements.incomesList.innerHTML = '';
  view.elements.expensesList.innerHTML = '';
  model.budget.forEach(record => {
    view.renderRecord(record);
  });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
  // Отображаем текущий месяц и год
  displayMonth();
  
  // Отображаем все записи из localStorage при загрузке страницы
  displayBudgetRecords();
  
  // Пересчитываем и отображаем текущий бюджет
  view.renderBudget(model.calcBudget());

  // Вставляем случайные данные в форму
  insertTestData();
});

// Обработчик для добавления записи
view.elements.form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Проверка заполненности полей
  if (!view.checkEmptyFields()) return;
  
  // Получаем данные из формы
  const formData = view.getFormData();

  // Добавляем новую запись в модель
  model.createRecord(formData);
  
  // Обновляем список записей
  displayBudgetRecords();
  
  // Очищаем форму
  view.clearForm();
  
  // Вставляем случайные данные снова после добавления новой записи
  insertTestData();
  
  // Обновляем отображение бюджета
  view.renderBudget(model.calcBudget());
});

// Обработчик для удаления записи
document.body.addEventListener("click", function (e) {
  if (e.target.closest("button.item__remove")) {
    const id = +view.removeRecord(e); // Получаем ID записи
    model.deleteRecord(id);           // Удаляем запись из модели
    displayBudgetRecords();           // Обновляем список записей
    view.renderBudget(model.calcBudget()); // Пересчитываем и отображаем бюджет
  }
});


function init () {
  displayMonth();
  insertTestData();
  view.renderBudget(model.calcBudget());
}

function insertTestData() {
  const randomData = model.getTestData();
  view.renderTestData(randomData);
}

function displayMonth() {
  const monthYear = model.getMonthYear();
  view.renderManths(monthYear.month, monthYear.year);
}
