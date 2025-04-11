/**
 * Набор функций с запросами к серверу
 */
export class Requests {
    static #server_addr = `http://${new URL(window.location.href).hostname}:81/api`;
    /**
     * Функция-обёртка для fetch
     * @param promise
     * @returns {Promise<any> | null}
     */
    static #throwResponse = promise => promise.then(
        response => response.ok ? response : reject(response),
        error => {throw error}
    ).then(
        promise => promise.clone().json().catch(() => Promise.reject(promise.text())),
        error => {throw error}
    ).then(
        json => json,
        other => {
            other.then(text => console.error(text));
            return null;
        }
    ).catch(({message, status, statusText}) => {
        console.error(`${status !== undefined ? status+': '+statusText : ''}${message ?? ''}`);
        return null;
    });

    /**
     *
     * @returns {Promise<*>|null}
     */
    static getDataOFContacts = () => this.#throwResponse(fetch(
        // this.#server_addr,
        `/additional_data/contacts.json`,
        {method: 'GET'}
    ));
    /**
     *
     * @returns {Promise<*>|null}
     */
    static getContactFormMap = () => this.#throwResponse(fetch(
        `/additional_data/contactFormMap.json`,
        {method: 'GET'}
    ));
    /**
     *
     * @returns {Promise<*>|null}
     */
    static postContactData = (data) => this.#throwResponse(fetch(
        this.#server_addr,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: data
        }
    ));

    static putContactData = (data) => this.#throwResponse(
        fetch(
        this.#server_addr,
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: data
        }
    )
    );
}

