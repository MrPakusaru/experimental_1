import {Requests} from './requests.js';

/**
 * Набор функций для запросов внутри страницы
 */
export class RequestsLocal {
    /**
     * Получает значение cookie по ключу
     * @param name
     * @returns {string|undefined}
     */
    static getCookie = (name) => (
        document.cookie.match(
            `(?:^|; )${name}=([^;]*)`
        ) || []
    )[1] || undefined;
    /**
     * Собирает Headers для fetch запросов.
     * @returns {*}
     */
    static assembleHeaders = () => {
        let {name, token} = this.#getTokenXsrfOrCsrf();
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'application/x-www-form-urlencoded',
            [name]: token
        };
    };
    /**
     * Возвращает пару ключ-значение X-XSRF-TOKEN или X-CSRF-TOKEN, если первое отсутствует.
     * @returns {{name: (string), token: (string|string)}}
     */
    static #getTokenXsrfOrCsrf = () => {
        let xsrf = this.getCookie('XSRF-TOKEN')
        return {
            name: xsrf === undefined ? 'X-CSRF-TOKEN' : 'X-XSRF-TOKEN',
            token: xsrf === undefined ? sessionStorage.getItem('X-CSRF-TOKEN') : xsrf
        };
    };
    /**
     * Получает CSRF-TOKEN со стороны сервера и сохраняет в sessionStorage.
     */
    static getTokenFirst = () => {Requests.getTokenCSRF().then(promise => {
        sessionStorage.setItem('X-CSRF-TOKEN', promise['X-CSRF-TOKEN']);
    })};
    /**
     * Редактирует неправильные(?) знаки в XSRF-TOKEN.
     * @returns {`XSRF-TOKEN=${string}`}
     */
    static replaceXSRF = () => document.cookie = `XSRF-TOKEN=${
        this.getCookie('XSRF-TOKEN').replace('%3D', '=')
    }`;
    /**
     * Оформляет данные в формат JSON.
     * @param data
     * @returns {string}
     */
    static prepareDataToJSON = (data = null) => JSON.stringify({data: data});
}
