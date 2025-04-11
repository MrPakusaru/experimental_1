import {Requests} from "./requests.js";
import {GeneratorFragments} from "./generatorFragments.js";
import {ContactsData} from "./contactsData.js";
import {DateValidation} from "./dateValidation.js";

let CONTACTS;

/**
 * Набор функций генерации 'окон' с данными контактов
 */
export class GeneratorElements {
    /**
     * Генерирует таблицу с контактами, получая на вход массив контактов
     */
    static genContactsTable() {
        if ($('.contacts_table').length) return;
        Requests.getDataOFContacts().then(data => {
            CONTACTS = new ContactsData().setListFromDB(data);
            $('main').append(
                GeneratorFragments.genElementWindow(
                    'contacts_table',
                    'Список контактов',
                    [$('<button>').addClass('new_contact').text('Новый контакт')],
                    [
                        $('<div>').addClass('contacts_head_row').append(this.#tableFragments.genRow(
                            'contacts_h_title',
                            ['col_name', 'col_email', 'col_phone', 'col_birthday'],
                            ['Name', 'Email', 'Phone', 'Birthday']
                        )),
                        $('<div>').addClass('contacts_body').append(
                            this.#tableFragments.genInner()
                        )
                    ]
                )
            );
            //Обработчики событий:
            //Добавить обработчик на кнопку создания контакта
            $('.contacts_table button.new_contact').on('click', () => this.genContactForm());
            //Добавить обработчик на строку контакта
            $('div.contacts_b_row').on('click', contactRow => {
                this.genContactForm(CONTACTS.getById(Number($(contactRow.currentTarget).attr('id_val'))));
                $('button.close').on('click', button =>
                    button.currentTarget.closest('.window').remove()
                )
            });
        });
    }

    /**
     * Генерирует форму работы с данными контакта
     * @param data
     */
    static genContactForm(data = null) {
        if ($('.contact_form').length) return;
        const {typeForm} = this.#formFragments.data = {contacts: data, typeForm: data === null ? 'add' : 'edit'}
        Requests.getContactFormMap().then(formMap => {
            $('main').append(GeneratorFragments.genElementWindow(
                'contact_form',
                `${data === null ? 'Создать' : 'Редактировать'} контакт`,
                [
                    $('<input>')
                        .attr({
                            num_item: 0,
                            form: `${typeForm}_contact`,
                            type: 'submit',
                            value: 'Сохранить'
                        }),
                    $('<button>')
                        .addClass('material-icons close')
                        .text('close')
                        .css({'font-size': 'calc(var(--base-size)* 1.5)'})
                ],
                [
                    $('<form>')
                        .attr({
                            id: `${typeForm}_contact`
                        }),
                    $('<div>')
                        .addClass('form_inputs')
                        .append(this.#formFragments.genRows(formMap))
                ]
            ));
            //Обработчики событий:
            //Обработчик на кнопку закрытия окна
            $('button.close').on('click', e =>
                e.currentTarget.closest('.window').remove()
            );
            //Определить поля даты
            let dateElements = {
                all: $('#field_day_id, #field_month_id, #field_year_id'),
                day: $('#field_day_id'),
                month: $('#field_month_id'),
                year: $('#field_year_id'),
                achtung: $('.achtung')
            }
            //Обработчик на валидацию полей даты при их изменении
            dateElements.all.on('change', () => DateValidation.checkFieldsOfDate(dateElements));
            //Обработчик на валидацию полей даты
            $(`#${typeForm}_contact`).on('submit', (form) => {
                form.preventDefault();
                if(data === null) {
                    // console.log($(form.currentTarget).serializeArray());
                    Requests.postContactData($(form.currentTarget).serialize()).then(r => console.log(r))
                    //TODO
                }
                else Requests.putContactData($(form.currentTarget)).then(r => console.log(r))
            });
        });
    }
    /**
     * Набор функций, отвечающих за генерацию таблицы контактов
     */
    static #tableFragments = {
        /**
         * Генерирует таблицу с контактами, получая на вход массив с данными контактов
         * @returns {jQuery[]} Массив из элементов JQuery
         */
        genInner: () => {
            //Если контактов нет, то вывести 'пусто'
            if (CONTACTS === null) return [
                $('<div>')
                    .text('Пока что тут пусто')
                    .addClass('contacts_b_none')
            ];
            const cArray = CONTACTS.getList();
            return Array.from(cArray, (contact, index) => {
                //Деструктуризация каждого контакта
                const {surname_val, name_val, last_name_val, email_val, tel_val, day_val, month_val, year_val, id_val} = contact;
                //Установка формата вывода чисел в виде '00'
                const format = num => num.toString().padStart(2, '0');
                //Генерация строки из полученных полей
                return [
                    $('<div>').addClass('contacts_b_row').attr('id_val', id_val).append(this.#tableFragments.genRow(
                        'contacts_b_field',
                        ['col_name', 'col_email', 'col_phone', 'col_birthday'],
                        [
                            `${surname_val} ${name_val} ${last_name_val}`,
                            email_val, tel_val,
                            `${format(day_val)}.${format(month_val)}.${year_val}`
                        ]
                    )),
                    //Если последняя строка, не возвращать линию
                    index !== cArray.length-1 ? $('<hr>').addClass('line') : null
                ];
            }).flat();
        },

        /**
         * Генерирует строки из jQuery объектов, получая на вход class 'роли', массив классов колонок и соотв. массив их значений
         * @param columnRoleClass {string} Атрибут `class` с 'ролью' объектов в строке
         * @param columnClasses {string[]} Массив с атрибутами `class` для каждого объекта в строке
         * @param values {string[]} Массив со значениями каждого объекта в строке
         * @returns {jQuery[]} Массив из элементов JQuery
         */
        genRow(columnRoleClass, columnClasses, values = null) {
            //Внутри map(): создать элемент, добавить класс общей роли (заголовок/строка) и класс столбца, добавить текст, если values не null
            return columnClasses.map(
                (columnClass, index) => $('<div>')
                    .addClass(`${columnRoleClass} ${columnClass}`)
                    .text(values?.[index] ?? '')
            );
        }
    }
    /**
     * Набор функций, отвечающих за генерацию формы
     */
    static #formFragments = {
        data: {
            contacts: null,
            typeForm: null,
        },

        /**
         * Генератор дорожек для формы. Получает массив объектов и генерирует по нему иерархическую структуру из элементов формы.
         * @param formMapArray {({})[]}
         * @returns {jQuery[]} Массив из элементов JQuery
         */
        genRows: (formMapArray) => {
            return formMapArray.map(({fields, ico, typeRow}) => {
                if (typeRow === 'fields') return $('<div>').addClass('input_row').append(
                    // Если `row.ico` в значении `null`, то генерировать пустой элемент-иконку. Иначе генерировать с названием
                    ico === null ? $('<i>') : $('<i>').addClass('material-icons').text(ico),
                    //Перебор полей в каждом наборе и выдача генерации в виде набора объектов JQuery
                    ...fields.map(field => {
                        const {tagInput, attributes, labelName} = field;
                        //Если тэг поля оказался `div`, то вернуть элемент-уведомление (для сообщений пользователю)
                        if (tagInput === 'div') return $(`<${tagInput}>`).addClass(attributes.class);
                        //В других случаях вернуть собранный элемент-поле с возможной генерацией внутри
                        return $('<input_custom>').addClass('valid_input').append(this.#formFragments.genFields(field),
                            //Если нужно к полю добавлять `label`, то генерировать элемент с подставлением значений
                            labelName === null ? null : $('<label>').attr({for: attributes.id}).text(labelName)
                        );
                    })
                );
                //Если тип дорожки это разделяющая линия, то вернуть элемент линию
                if (typeRow === 'line') return $('<hr>').addClass('line');
            });


        },

        /**
         * Генератор для полей формы. Получает объект с атрибутами input/select/etc и генерирует по нему поле для ввода.
         *
         * В случае значения fields.innerElems = 'optionMonths' генерирует внутри <select> набор <option> с месяцами.
         * @param fields
         * @returns {jQuery} Элемент JQuery
         */
        genFields: ({tagInput, attributes, innerElems})=> {
            const {typeForm, contacts} = this.#formFragments.data;
            //Генерация базового поля
            let simpleField = $(`<${tagInput}>`).attr({
                ...attributes,
                form: `${typeForm}_contact`
            });
            //При fields.innerElems = 'monthOptions' возвращает <select> с набором <option> с месяцами внутри
            if(innerElems === 'monthOptions') simpleField.append(GeneratorFragments.genMonthOptions());
            //Если данные контакта имеются, то заполнить каждое поле соотв. данными
            if (contacts!==null) simpleField.val(contacts[attributes.name]);
            //При остальных значениях 'fields.innerElems' возвращает базовое поле
            return simpleField;
        }
    }
}