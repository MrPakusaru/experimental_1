/**
 * Класс, который управляет массивами контактов
 */
export class ContactsData {
    #contacts = [];
    /**
     * Получает массив объектов формата БД и преобразует его в простой для работы со свойствами контактов
     * Если входящий массив отсутствует, то массив контактов также будет отсутствующим
     * @param arrayDB Массив контактов во вложенном формате (БД)
     * @returns {ContactsData}
     */
    setListFromDB(arrayDB) {
        this.#contacts = arrayDB['data']?.map(
            ({
                 id_val,
                 full_name,
                 connections,
                 date_birth
            }) => ({
                id_val,
                ...full_name,
                ...connections,
                ...date_birth
            })
        ) ?? [];
        return this;
    }

    /**
     * Возвращает массив `object` контактов
     * @returns {[]}
     */
    getList = () => this.#contacts;

    /**
     * Получает id контакта и возвращает `object` контакт
     *
     * @param id    Ключевое значение контакта
     * @returns {*} `Object` контакт
     */
    getById = (id) => (typeof id === 'number' && id >= 0) ? this.#contacts.find(contact => contact['id_val'] === id) : null;
}