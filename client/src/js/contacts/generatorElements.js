import {Requests as Req} from './requests.js';
import {GeneratorFragments} from './generatorFragments.js';
import {ContactsData} from './contactsData.js';
import {ObjectListeners as OL} from "./objectListeners.js";

let CONTACTS = null;
let FORM_MAP = null;

/**
 * Набор функций генерации 'окон' с данными контактов
 */
export class GeneratorElements {
    /**
     * Генерирует таблицу с контактами, получая на вход массив контактов
     */
    static genContactsTable() {
        if ($('.contacts_table').length) return;
        Req.getContacts().then(data => {
            CONTACTS = new ContactsData().setListFromDB(data);
            $('main').append(
                GeneratorFragments.genElementWindow(
                    'contacts_table',
                    'Список контактов',
                    [$('<button>').addClass('new_contact').text('Новый контакт')],
                    [
                        $('<div>').addClass('contacts_head_row').append(this.#tableFragments.genRow(
                            'contacts_h_title',
                            ['col_name', 'col_email', 'col_phone', 'col_birthday', {'div': ['col_action']}],
                            ['Name', 'Email', 'Phone', 'Birthday']
                        )),
                        $('<div>').addClass('contacts_body').append(
                            this.#tableFragments.genInner()
                        )
                    ]
                )
            );
            //Обработчики событий:
            OL.newContactButton(); //Обработчик на кнопке создания контакта
            OL.selectContactRow(CONTACTS); //Обработчик на строке контакта
            OL.deleteContactButton(CONTACTS)//Обработчик на кнопке удаления контакта
        });
    }
    /**
     * Обновляет наполнение списка контаков при получении ответа от сервера
     * @param data JSON список контактов от сервера
     */
    static updateContactsTable = data => {
        CONTACTS = new ContactsData().setListFromDB(data);
        $('div.contacts_body').replaceWith($('<div>')
            .addClass('contacts_body')
            .append(this.#tableFragments.genInner())
        );
        //Обработчики событий:
        OL.selectContactRow(CONTACTS); //Обработчик на строке контакта
        OL.deleteContactButton(CONTACTS)//Обработчик на кнопке удаления контакта
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
                const {email_val, tel_val, day_val, month_val, year_val, id_val} = contact.getData();
                const fullName = contact.getFullName();
                //Установка формата вывода чисел в виде '00', если пусто, то '–'
                const format = num => num?.toString().padStart(2, '0') ?? null;
                // Если пусто, то пробел
                const isset = (value, numLines = 0) => value ?? (numLines>0 ? '\u2013'.repeat(numLines) : ' ');
                //Генерация строки из полученных полей
                return [
                    $('<div>').addClass('contacts_b_row').attr('id_val', id_val).append(
                        $('<div>').addClass('contacts_b_fields').append(this.#tableFragments.genRow(
                            'contacts_b_field',
                            ['col_name', 'col_email', 'col_phone', 'col_birthday'],
                            [
                                `${fullName}`,
                                isset(email_val),
                                isset(tel_val),
                                `${isset(format(day_val), 2)}.${isset(format(month_val), 2)}.${isset(year_val, 4)}`
                            ]
                        )),
                        this.#tableFragments.genRow('',[{'i': ['col_action', 'material-symbols-outlined']}],['delete'])
                        // $('<i>').addClass(['col_action', 'material-symbols-outlined'].join(' '))
                    ),
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
        genRow: function (columnRoleClass, columnClasses, values = null) {
            //Внутри map(): создать элемент, добавить класс общей роли (заголовок/строка) и класс столбца, добавить текст, если values не null
            return columnClasses.map((columnClass, index) => {
                switch (typeof columnClass) {
                    case 'object':
                        return $(`<${Object.keys(columnClass)[0]}>`)
                            .addClass(columnClass[Object.keys(columnClass)[0]].join(' '))
                            .text(values?.[index] ?? '');
                    default:
                        return $('<div>')
                            .addClass([columnRoleClass, columnClass].join(' '))
                            .text(values?.[index] ?? '');
                }}
            );
        }
    }
    /**
     * Генерирует форму работы с данными контакта
     * @param data JSON список контактов от сервера
     */
    static genContactForm(data = null) {
        //Проверяет, имеется ли в памяти набор для построения формы
        const issetFORM_MAP = functions => {
            //Если нет, то сохраняет его и использует.
            if(FORM_MAP===null) Req.getContactFormMap().then(formMap => functions(FORM_MAP = formMap));
            //Если да, то просто использует.
            else functions(FORM_MAP);
        }
        //Если входищие данные есть, то форма для редактирования контакта.
        //Если нет, то для создания.
        this.#formFragments.data = {
            contacts: data,
            typeForm: data === null ? 'add' : 'edit'
        }
        if (!$('.contact_form').length) {
            issetFORM_MAP(formMap => {
                $('main').append(GeneratorFragments.genElementWindow(
                    'contact_form',
                    `${data === null ? 'Создать' : 'Редактировать'} контакт`,
                    [
                        $('<input>')
                            .attr({
                                num_item: 0,
                                form: `${this.#formFragments.data.typeForm}_contact`,
                                type: 'submit',
                                value: 'Сохранить'
                            }),
                        $('<button>')
                            .addClass('material-symbols-outlined close')
                            .text('close')
                            .css({'font-size': 'calc(var(--base-size)* 1.5)'})
                    ],
                    [
                        $('<form>')
                            .attr({
                                id: `${this.#formFragments.data.typeForm}_contact`
                            }),
                        $('<div>')
                            .addClass('form_inputs')
                            .append(this.#formFragments.genRows(formMap))
                    ]
                ));
                //Обработчики событий:
                OL.setCloseButton(); //Обработчик на кнопке закрытия окна
                OL.checkDateValidation(); //Обработчик на валидацию полей даты при их изменении
                OL.saveOrUpdateContact(data, this.#formFragments.data.typeForm); //Обработчик на кнопку submit
            });
        } else issetFORM_MAP(formMap => this.#formFragments.updateFormFields(data, formMap));

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
         * Обновляет наполнение списка контаков при получении ответа от сервера
         * @param formMap Объект с правилами генерации формы
         * @param data JSON список контактов от сервера
         */
        updateFormFields: (data, formMap) => {
            let formJQ = $('.contact_form form');
            if(formJQ.attr('id')==='add_contact') {
                $('.window_b_head').text('Редактировать контакт');
                $(`.contact_form .window_b_item[type='submit']`).attr({form: 'edit_contact'});
                formJQ.attr({id: 'edit_contact'});
            }
            $('div.form_inputs').replaceWith($('<div>')
                .addClass('form_inputs')
                .append(this.#formFragments.genRows(formMap))
            );
            OL.checkDateValidation(); //Обработчик на валидацию полей даты при их изменении
            OL.saveOrUpdateContact(data, 'edit_contact'); //Обработчик на кнопку submit
        },
        /**
         * Генератор дорожек для формы. Получает массив объектов и генерирует по нему иерархическую структуру из элементов формы.
         * @param formMapArray {({})[]}
         * @returns {jQuery[]} Массив из элементов JQuery
         */
        genRows: formMapArray => {
            return formMapArray.map(({fields, ico, typeRow}) => {
                if (typeRow === 'fields') return $('<div>').addClass('input_row').append(
                    // Если `row.ico` в значении `null`, то генерировать пустой элемент-иконку. Иначе генерировать с названием
                    ico === null ? $('<i>') : $('<i>').addClass('material-symbols-outlined').text(ico),
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
            if(innerElems === 'monthOptions') {
                simpleField.append(GeneratorFragments.genMonthOptions());
                //Если входящее значение месяца `null`, то заменить его на 'none'.
                if (typeForm === 'edit' && contacts['month_val'] === null) contacts.month_val = 'none';
            }
            //Если данные контакта имеются, то заполнить каждое поле соотв. данными
            if (contacts!==null) simpleField.val(contacts[attributes.name]);
            //При остальных значениях 'fields.innerElems' возвращает базовое поле
            return simpleField;
        }
    }
}
