import {ContactObject as Cnt} from "./contactObject.js";
/**
 * Класс, который управляет массивами контактов
 */
export class ContactsData {
    /**
     * Массив контактов
     * @type {[ContactObject]}
     */
    #contacts = [];
    /**
     * Получает массив объектов формата БД и преобразует его в простой для работы со свойствами контактов
     * Если входящий массив отсутствует, то массив контактов также будет отсутствующим
     * @param arrayDB Массив контактов во вложенном формате (БД)
     * @returns {ContactsData}
     */
    setListFromDB(arrayDB) {
        this.#contacts = arrayDB['data']?.map(contact => new Cnt().setDataFromDB(contact)) ?? [];
        return this;
    }
    /**
     * Возвращает массив `object` контактов
     * @returns {[ContactObject]}
     */
    getList = () => this.#contacts;
    /**
     * Получает id контакта и возвращает `object` контакт
     *
     * @param id {number}   Ключевое значение контакта
     * @returns {ContactObject} `Object` контакт
     */
    getById = (id) => (typeof id === 'number' && id >= 0) ? this.#contacts.find(contact => contact.getData('id_val') === id) : null;
}