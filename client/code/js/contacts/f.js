$(function() {
    let inputs = {
        day: $('input[name="day"]'),
        month: $('select[name="month"]'),
        year: $('input[name="year"]'),
        all: $('input[name="day"], select[name="month"], input[name="year"]')
    };
    inputs.all.on('change', () => checkFieldsOfDate(inputs));
    $('div.window.contacts_table div.window_bar button').on('click', function () {
        //TODO
    });
});
//TODO: добавить текст с подсказкой как у гугла.
//TODO: В случае похожего окна добавить способ различать окна с похожими полями, чтобы не светились все вместе
/**
 * Меняет класс у полей day, month и year, тем самым включая и выключая их подсветку
 * @param isValid
 * @param elements
 */
const changeValidity = (isValid, elements) => {
    elements.toggleClass('valid_input', isValid).toggleClass('invalid_input', !isValid);
};

/**
 * Подсвечивает поля day, month и year в зависимости от корректности введённой в них даты
 * @param {any} fields
 */
function checkFieldsOfDate(fields) {
    //Получает из полей классом day, month и year свойство value
    const [day, month, year] = fields.all.toArray().map(el => el.value);
    let actionMatrix = [
        // Если все поля пустые, то подсветки нет
        {
            condition: () => year === '' && day === '' && month === 'none',
            action: () => changeValidity(true, fields.all.parent())
        },
        // Если year пустой и есть ошибки в day или month, то в полях day и month подсветка
        {
            condition: () => year === '' && (day === '' || month === 'none'),
            action: () => {
                changeValidity(false, fields.all.not('[name="year"]').parent());
                changeValidity(true, fields.year.parent());
            }
        },
        // Если year, day и month заполнены корректно, то нет подсветки
        {
            condition: () => validateDate(day, month, year),
            action: () => changeValidity(true, fields.all.parent())
        },
        // Все остальные случаи (если year, day и month заполнены корректно) - то все поля подсвечены
        {
            condition: () => true,
            action: () => changeValidity(false, fields.all.parent())
        }
    ];
    // Поиск и выполнение первого подходящего условия
    actionMatrix.find(state => state.condition()).action();
}


/**
 * Проверяет значение входящей даты, возвращает true, если полученная дата существует. Иначе возвращает false.
 * @param day День
 * @param month Месяц
 * @param year Год
 * @returns {boolean} Результат проверки
 */
function validateDate(day, month, year) {
    // Создаёт объект Date с переданными значениями. Если year пусто - то проверяет дату високосного года
    const date = year!=='' ? new Date(year, month, day) : new Date(2000, month, day);
    // Проверяет, соответствует ли созданная дата введённым значениям
    return (date.getDate() === Number(day)) && (date.getMonth() === Number(month));
}