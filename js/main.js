const form = document.querySelector('#form');
const type = document.querySelector('#type');
const title = document.querySelector('#title');
const value = document.querySelector('#value');
const incomesList = document.querySelector('#incomes-list');

const budget = [];

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let  id = 1;
    if (budget.length > 0) {
        id = budget[budget.length - 1].id + 1;
    }
    const record = {
    id:id,
    type: type.value,
    title: title.value,
    value: parseFloat(value.value)
    }

    budget.push(record);
    console.log(budget);

    if (record.type === 'inc') {
        const html = `<li id="${record.id}" class="budget-list__item item item--income">
            <div class="item__title">"${record.title}"</div>
            <div class="item__right">
            <div class="item__amount">+ "${record.value}"</div>
            <button class="item__remove">
            <img src="./img/circle-green.svg" alt="delete" />
            </button>
            </div>
        </li>`
        incomesList.insertAdjacentHTML('beforeend', html);
        }

     
});




