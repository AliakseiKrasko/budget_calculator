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
}

function checkEmptyFields () {
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
const priceFormater = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
});

function renderRecord(record) {
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
      elements.incomesList.insertAdjacentHTML("beforeend", html);
    } else {
      elements.expensesList.insertAdjacentHTML("afterbegin", html);
    }
  }
  

 


export { elements, priceFormater, checkEmptyFields, renderRecord };