$(function() {
    let DateInputs = {
        all: $('input[name="day"], select[name="month"], input[name="year"]'),
        day: $('input[name="day"]'),
        month: $('select[name="month"]'),
        year: $('input[name="year"]')
    };
    DateInputs.all.on('input',function () {
        console.log([DateInputs.day.val(),DateInputs.month.val(),DateInputs.year.val()]);
        if(DateInputs.day.val()!=='' && DateInputs.month.val()!=='none') {



            let correctDate = validateDate(DateInputs.day.val(), DateInputs.month.val(), DateInputs.year.val());

            console.log('correct? - ' + correctDate)

        } else { console.log('not full');}


    });
});

function validateDate(day, month, year) {
    // Создаем объект Date с переданными значениями
    const date = new Date(year, month, day);
    // Проверяем, соответствует ли созданная дата введённым значениям
    return (date.getDate() === Number(day)) && (date.getMonth() === Number(month));
}
//TODO: при нажатии на сохранить если день или месяц не заполнены, должно высвечиваться предупреждение
//TODO: также ошибка, если некорректная дата