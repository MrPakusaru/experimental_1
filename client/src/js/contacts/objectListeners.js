import {GeneratorElements as GElem} from "./generatorElements.js";
import {Requests as Req} from "./requests.js";
import {DateValidation} from "./dateValidation.js";
import {ContactObject as Contact} from "./contactObject.js";

/**
 * Класс, содержащий функции, устанавливающие прослушиватели событий
 */
export class ObjectListeners {
    /**
     * В случае нажатия на кнопку '.new_contact' запускает генерацию формы
     */
    static newContactButton() {
        $('.contacts_table button.new_contact').on('click', () => GElem.genContactForm());
    }
    /**
     * В случае нажатия на элемент 'div.contacts_b_fields' запускает генерацию формы
     * @param contacts {ContactsData}
     */
    static selectContactRow(contacts) {
        $('div.contacts_b_fields').on('click', contactRow => {
            GElem.genContactForm(contacts.getById(Number(
                $(contactRow.currentTarget).closest('div.contacts_b_row').attr('id_val')
            )).getData());
            this.setCloseButton(); //Обработчик на кнопке закрытия окна
        });
    }
    /**
     * В случае нажатия на "кнопку" 'i.col_action' запускает удаление контакта по его 'id_val'
     * @param contacts {ContactsData}
     */
    static deleteContactButton(contacts) {
        $('i.col_action').on('click', contactRow => {
            const contact = contacts.getById(Number(
                $(contactRow.currentTarget).closest('div.contacts_b_row').attr('id_val')
            ));
            if (confirm(`Вы действительно хотите удалить контакт\n"${contact.getFullName()}"?`)) Req.deleteContactData(
                {id_val: contact.getData('id_val')}
            ).then(
                data => {
                    console.log('deleteContactData:', data.status);
                    GElem.updateContactsTable(data);
                }
            )
        });
    }
    /**
     * В случае нажатия на кнопку '.close' "закрывает окно"
     */
    static setCloseButton() {
        $('button.close').on('click', button =>
            button.currentTarget.closest('.window').remove()
        )
    }
    /**
     * В случае изменения содержания полей проводит валидацию даты
     */
    static checkDateValidation() {
        const fieldsId = ['#field_day_id', '#field_month_id', '#field_year_id'];
        $(fieldsId.join(', ')).on('change', () => DateValidation.checkFieldsOfDate(fieldsId));
    }
    /**
     * В случае подтверждения формы запускает сохранение нового, либо обновление текущего контакта
     * @param data {ContactObject} `Object` контакт
     * @param typeForm {string} Тип формы. 'add' или 'edit'
     */
    static saveOrUpdateContact(data, typeForm) {
        $(`#${typeForm}_contact`).on('submit', (form) => {
            //Отменяет поведение браузера по умолчанию
            form.preventDefault();
            //Создание и наполнения объекта Contact данными с формы
            let currentContact = new Contact().createFromForm($(form.currentTarget).serializeArray()).getData();
            if(data === null) {
                Req.postContactData(currentContact).then(data => {
                    console.log('postContactData:', data.status);
                    GElem.updateContactsTable(data);
                })
            }
            else {
                if(Contact.ifChanged(currentContact, data)) Req.putContactData(currentContact).then(data => {
                    console.log('putContactData:', data.status);
                    GElem.updateContactsTable(data);
                })
            }
        });
    }
}
