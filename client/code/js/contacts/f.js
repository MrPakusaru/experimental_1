$(function() {
    let DateInputs = {
        all: $('input[name="day"], select[name="month"], input[name="year"]'),
        day: $('input[name="day"]'),
        month: $('select[name="month"]'),
        year: $('input[name="year"]')
    };
    DateInputs.all.on('input',function () {
        if(DateInputs.day.val()!=='' && DateInputs.month.val()!=='none') {
            showInvalidDate(validateDate(DateInputs.day.val(), DateInputs.month.val(), DateInputs.year.val()));
        } else { showInvalidDate(undefined); }
    });
});

function showInvalidDate (e) {
    switch (e) {
        case true:
            console.log('correct');
            break;
        case false:
            console.log('no correct');
            break;
        case undefined:
            console.log('not full');
            break;
    }
}
function validateDate(day, month, year) {
    // Создаем объект Date с переданными значениями. Если year пусто - то проверяем дату високосного года
    const date = year!=='' ? new Date(year, month, day) : new Date(2000, month, day);
    // Проверяем, соответствует ли созданная дата введённым значениям
    return (date.getDate() === Number(day)) && (date.getMonth() === Number(month));
}
//TODO: при нажатии на сохранить если день или месяц не заполнены, должно высвечиваться предупреждение
//TODO: также ошибка, если некорректная дата

