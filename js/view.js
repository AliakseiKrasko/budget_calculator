// Получаем ссылки на элементы формы и элементы для отображения данных
const elements = {
    form: document.querySelector("#form"),
    type: document.querySelector("#type"),
    title: document.querySelector("#title"),
    value: document.querySelector("#value"),
    incomesList: document.querySelector("#incomes-list"),
    budgetElement: document.querySelector("#budget"),
    expensesList: document.querySelector("#expenses-list"),
    totalIncomeElement: document.querySelector("#total-income"),
    totalExpensesElement: document.querySelector("#total-expense"),
    persentWrapper: document.querySelector("#expense-percents-wrapper"),
    monthElement: document.querySelector("#month"),
    yearElement: document.querySelector("#year"),
  };
  
  // Функция для проверки заполненности полей формы
  function checkEmptyFields() {
    if (elements.title.value.trim() === "") {
      elements.title.classList.add("form__input__error");
      return false; // Возвращаем false при ошибке
    } else {
      elements.title.classList.remove("form__input__error");
    }
  
    if (elements.value.value.trim() === "" || +elements.value.value <= 0) {
      elements.value.classList.add("form__input__error");
      return false; // Возвращаем false при ошибке
    } else {
      elements.value.classList.remove("form__input__error");
    }
  
    return true; // Если все поля заполнены корректно
  }
  
  // Форматирование цен для отображения в валюте
  const priceFormater = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });
  
  // Функция для отображения записи в списке
  function renderRecord(record) {
    const html = `
      <li data-id="${record.id}" class="budget-list__item item item--${record.type === "inc" ? "income" : "expense"}">
        <div class="item__title">${record.title}</div>
        <div class="item__right">
          <div class="item__amount">${record.type === "inc" ? "+" : "-"} ${priceFormater.format(record.value)}</div>
          <button class="item__remove">
            <img src="./img/circle-${record.type === "inc" ? "green" : "red"}.svg" alt="delete" />
          </button>
        </div>
      </li>
    `;
  
    // Вставляем запись в список доходов или расходов
    if (record.type === "inc") {
      elements.incomesList.insertAdjacentHTML("beforeend", html);
    } else {
      elements.expensesList.insertAdjacentHTML("afterbegin", html);
    }
  }
  
  // Функция для рендеринга бюджета (доходы, расходы, проценты)
  function renderBudget({ totalIncome, totalExpense, totalBudget, expensePercents }) {
    // Обновляем отображение бюджета, доходов и расходов
    elements.budgetElement.innerHTML = priceFormater.format(totalBudget);
    elements.totalIncomeElement.innerHTML = `+ ${priceFormater.format(totalIncome)}`;
    elements.totalExpensesElement.innerHTML = `- ${priceFormater.format(totalExpense)}`;
  
    // Обновляем проценты расходов
    elements.persentWrapper.innerHTML =
      expensePercents > 0
        ? `<div class="header__value">${expensePercents}%</div>`
        : "";
  }
  
  // Очищаем форму после добавления данных
  function clearForm() {
    elements.form.reset();
  }
  
  // Функция для отображения месяца и года
  function renderManths(month, year) {
    elements.monthElement.innerHTML = month;
    elements.yearElement.innerHTML = year;
  }
  
  // Функция для вставки случайных тестовых данных в форму
  function renderTestData(data) {
    elements.type.value = data.type;
    elements.title.value = data.title;
    elements.value.value = data.value;
  }
  
  // Получаем данные из формы
  function getFormData() {
    return {
      type: elements.type.value,
      title: elements.title.value,
      value: elements.value.value,
    };
  }
  
  // Функция для удаления записи
  function removeRecord(e) {
    const recordElement = e.target.closest("li.budget-list__item");
    const id = recordElement.dataset.id;
    recordElement.remove(); // Удаляем запись из DOM
    return id;
  }
  
  export {
    elements,
    priceFormater,
    checkEmptyFields,
    renderRecord,
    renderBudget,
    clearForm,
    renderManths,
    renderTestData,
    getFormData,
    removeRecord,
  };
  