/**
 * Класс, управляющий данными контакта
 */
export class ContactObject {
    #data = {
        id_val: null,

        surname_val: null,
        name_val: null,
        last_name_val: null,

        email_val: null,
        tel_val: null,

        day_val: null,
        month_val: null,
        year_val: null,
    };
    /**
     * Возвращает ФИО контакта
     * @return {string}
     */
    getFullName = () => `${this.#data?.surname_val ?? ''} ${this.#data?.name_val ?? ''} ${this.#data?.last_name_val ?? ''}`;
    /**
     * Возвращает объект контакта
     * @returns {{year_val: null, day_val: null, email_val: null, tel_val: null, name_val: null, month_val: null, id: null, surname_val: null, last_name_val: null}}
     */
    getData = (parameter = '') => parameter === '' ? this.#data : this.#data[parameter];
    /**
     * Получает сериализованные данные формы в виде массива и возвращает объект контакта.
     * @param formContactData  Serialized Array Contact Data
     */
    createFromForm = formContactData => {
        this.setData(Object.fromEntries(formContactData.map(({name, value}) =>
            [name, !value.trim() || name === 'month_val' && value === 'none' ? null : value]
        )));
        return this;
    };
    /**
     * Из набора полей заполняет свойства контакта.
     * @param s
     * @returns {{year_val: null, day_val: null, email_val: null, tel_val: null, name_val: null, month_val: null, id: null, surname_val: null, last_name_val: null}}*/
    setData = (s) => {
        this.#data = {
            id_val: s.id_val,
            surname_val: s.surname_val,
            name_val: s.name_val,
            last_name_val: s.last_name_val,
            email_val: s.email_val,
            tel_val: s.tel_val,
            day_val: s.day_val,
            month_val: s.month_val,
            year_val: s.year_val,
        };
        return this;
    };
    /**
     * Из набора полей (на стороне сервера) заполняет свойства контакта.
     * @param s
     * @returns {{year_val: null, day_val: null, email_val: null, tel_val: null, name_val: null, month_val: null, id: null, surname_val: null, last_name_val: null}}*/
    setDataFromDB = ({id, surname, name, last_name, email, phone, birth_day, birth_month, birth_year}) => {
        this.#data = {
            id_val: id,
            surname_val: surname,
            name_val: name,
            last_name_val: last_name,
            email_val: email,
            tel_val: phone,
            day_val: birth_day,
            month_val: birth_month,
            year_val: birth_year,
        };
        return this;
    };
    /**
     * Сравнивает два ContactObject.#data на идентичность их свойства #data. Если есть разница, возвращает true.
     * @param dataNew {*}
     * @param dataLast {*}
     */
    static ifChanged = (dataNew, dataLast) => {
        //Превращает всё не null в текст
        const toStr = data => data?.toString() ?? null;
        //Проверка на значение месяца
        const ifMonth = (key, data) => key === 'month_val' && data === null ? 'none' : toStr(data);
        if(Object.keys(dataNew).length === Object.keys(dataLast).length) {
            return Object.keys(dataNew).reduce((acc, rec) =>
                acc || ifMonth(rec, dataNew[rec]) !== ifMonth(rec, dataLast[rec]), false)
        } else console.error('Количество свойств объектов различается');
        return null;
    }
}
