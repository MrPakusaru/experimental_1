import {RequestsLocal as RL} from "./requestsLocal.js";

/**
 * Набор функций с запросами к серверу
 */
export class Requests {
    /**
     * URL проксируемого сервера
     * @type {string}
     */
    static #server_addr = `http://${new URL(window.location.href).hostname}:81/api/`;
    /**
     * Возвращает полную ссылку из адреса сервера и остатка ссылки
     * @param restOfLink Остаток ссылки (всё, что после /)
     * @returns {string}
     */
    static toAPI = (restOfLink = '') => this.#server_addr.concat(restOfLink);
    /**
     * Способы обработать ответ от сервера
     * @type {{JSON: string, TEXT: string}}
     */
    static #contentType = {
        JSON: 'application/json',
        TEXT: 'text/html; charset=UTF-8'
    };

    /**
     * Функция-обёртка для fetch.
     *
     * Проверяет получаемый тип данных с ожидаемым.
     * Возвращает обработанный ответ внутри Promise.
     * В случае ошибки возвращает null.
     * @param fetchFunc Функция fetch со вложенными в неё параметрами
     * @param responseTypeContent Тип контента из ожидаемого ответа (брать из `this.#contentType`)
     * @returns {Promise<any> | null}
     */
    static #throwResponse = (fetchFunc, responseTypeContent) => fetchFunc.then(response => {
        RL.replaceXSRF();
        if (response.ok) return response;
        throw response;
    }).then(response => {
        if(response.headers.get('content-type')===responseTypeContent) return response;
        throw new Error(`Response is not '${responseTypeContent}'`);
    }).then(
        promise => {
            switch (responseTypeContent) {
                case this.#contentType.JSON: return promise.json();
                case this.#contentType.TEXT: return promise.text();
                default: throw new Error('Type response is not set or received otherwise');
            }
        }
    ).catch((error) => {
        console.error(`${error.status !== undefined ? error.status + ': ' + error.statusText : ''}${error.message ?? ''}`);
        return null;
    });
    /**
     * Отправляет запрос к серверу на получение списка контактов.
     * @returns {Promise<*>|null}
     */
    static getContacts = () => this.#throwResponse(fetch(
        this.toAPI('contacts'),
        {
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    ),this.#contentType.JSON);
    /**
     * Получает файл для генерации формы
     * @returns {Promise<*>|null}
     */
    static getContactFormMap = () => this.#throwResponse(fetch(
        `/additional_data/contactFormMap.json`,
        {
            method: 'GET'
        }
    ), this.#contentType.JSON);
    /**
     * Отправляет запрос к серверу на добавление нового контакта.
     * @returns {Promise<*>|null}
     */
    static postContactData = data => this.#throwResponse(fetch(
        this.toAPI('contact/new'),
        {
            method: 'POST',
            headers: RL.assembleHeaders(),
            credentials: 'include',
            body: RL.prepareDataToJSON(data)
        }), this.#contentType.JSON
    );
    /**
     * Отправляет запрос к серверу на обновление текущего контакта.
     * @param data
     * @returns {Promise<*>|null}
     */
    static putContactData = data => this.#throwResponse(fetch(
        this.toAPI('contact'),
        {
            method: 'PUT',
            headers: RL.assembleHeaders(),
            credentials: 'include',
            body: RL.prepareDataToJSON(data)
        }), this.#contentType.JSON
    );
    /**
     * Отправляет запрос к серверу на обновление текущего контакта.
     * @param data
     * @returns {Promise<*>|null}
     */
    static deleteContactData = data => this.#throwResponse(fetch(
        this.toAPI('contact'),
        {
            method: 'DELETE',
            headers: RL.assembleHeaders(),
            credentials: 'include',
            body: RL.prepareDataToJSON(data)
        }), this.#contentType.JSON
    );
    /**
     * Получает CSRF-TOKEN со стороны сервера
     * @returns {Promise<*>|null}
     */
    static getTokenCSRF = () => this.#throwResponse(fetch(
        this.toAPI('csrf-token'),
        {
            method: 'GET',
            credentials: 'include',
        }
    ), this.#contentType.JSON);
}
