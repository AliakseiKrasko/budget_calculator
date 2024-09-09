// Массив для хранения всех записей бюджета
let budget = JSON.parse(localStorage.getItem('budget')) || [];
if (!Array.isArray(budget)) {
  budget = [];
}

function createRecord(formData) {
    const id = budget.length > 0 ? budget[budget.length - 1].id + 1 : 1;
    const newRecord = {
        id: id,
        type: formData.type,
        title: formData.title.trim(),
        value: +formData.value,
    };
    
    // Добавляем новую запись в массив budget
    budget.push(newRecord);

    // Сохраняем обновленный массив в localStorage
    localStorage.setItem('budget', JSON.stringify(budget)); // Важно для сохранения данных

    return newRecord;
}

function deleteRecord(id) {
    // Находим и удаляем запись по ID
    budget = budget.filter(record => record.id !== id);

    // Сохраняем обновленный массив в localStorage после удаления
    localStorage.setItem('budget', JSON.stringify(budget));
}

function calcBudget() {
    const totalIncome = budget
      .filter(record => record.type === "inc")
      .reduce((total, record) => total + record.value, 0);

    const totalExpense = budget
      .filter(record => record.type === "exp")
      .reduce((total, record) => total + record.value, 0);

    const totalBudget = totalIncome - totalExpense;
    const expensePercents = totalIncome > 0 ? Math.round((totalExpense * 100) / totalIncome) : 0;

    return {
      totalIncome,
      totalExpense,
      totalBudget,
      expensePercents
    };
}

function getTestData() {
  
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
    return randomData;
  }
  
  function getMonthYear() {
    const now = new Date();
    const year = now.getFullYear();
    const timeFormater = new Intl.DateTimeFormat('ru-RU', { month: 'long' });
    const month = timeFormater.format(now);
  
    return { month, year };
  }

export { createRecord, deleteRecord, calcBudget, budget, getTestData, getMonthYear }
