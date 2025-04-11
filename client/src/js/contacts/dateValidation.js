/**
 * Отвечает за подсветку полей даты в случае ввода некорректной даты
 */
export class DateValidation {
    /**
     * Меняет класс у полей day, month и year, тем самым включая и выключая их подсветку
     * @param isValid
     * @param elements
     */
    static changeValidity(isValid, elements) {
        elements.toggleClass('valid_input', isValid).toggleClass('invalid_input', !isValid);
    }

    /**
     * Подсвечивает поля day, month и year в зависимости от корректности введённой в них даты
     * @param {any} fieldsDMY
     */
    static checkFieldsOfDate(fieldsDMY) {
        //Получает из полей классом day, month и year свойство value
        const [day, month, year] = fieldsDMY.all.toArray().map(el => el.value);
        const actionMatrix = [
            // Если все поля пустые, то подсветки нет
            {
                condition: () => day === '' && month === 'none',
                action: () => {
                    this.changeValidity(true, fieldsDMY.all.parent());
                    if (fieldsDMY.achtung.html() !== '') fieldsDMY.achtung.html('');
                }
            },
            // Если day или month пустое, а year только пустой, то в полях day и month подсветка.
            // Иначе если year заполнено, то все поля подсвечены
            {
                condition: () => day === '' || month === 'none',
                action: () => {
                    if (year === '') {
                        this.changeValidity(false, fieldsDMY.all.not('#field_year_id').parent()); //TODO
                        this.changeValidity(true, fieldsDMY.year.parent());
                    } else {
                        this.changeValidity(false, fieldsDMY.all.parent());
                    }
                    fieldsDMY.achtung.html('Укажите дату полностью.');
                }
            },
            // Если year, day и month заполнены корректно, то нет подсветки (янв = 1, для Date янв = 0)
            {
                condition: () => this.validateDate(day, month-1, year),
                action: () => {
                    this.changeValidity(true, fieldsDMY.all.parent());
                    if (fieldsDMY.achtung.html() !== '') fieldsDMY.achtung.html('');
                }
            },
            // Все остальные случаи, где все поля подсвечены
            {
                condition: () => true,
                action: () => {
                    this.changeValidity(false, fieldsDMY.all.parent());
                    fieldsDMY.achtung.html('Укажите допустимую дату.');
                }
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
    static validateDate(day, month, year) {
        // Создаёт объект Date с переданными значениями. Если year пусто - то проверяет дату високосного года
        const date = year!=='' ? new Date(year, month, day) : new Date(2000, month, day);
        // Проверяет, соответствует ли созданная дата введённым значениям
        return (date.getDate() === Number(day)) && (date.getMonth() === Number(month));
    }
}