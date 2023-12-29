/**
 * Получает данные JSON, обрабатывает статус и выполняет соотв. действие
 * @param {*} data
 * @param {string} action
 */
function handlerOfResponses(data, action = '') {
    let $iEr = $('#ifError');
    //console.log(data); //для проверки получаемых данных с сервера
    try {
        switch (data['code']) {
            case 200:
                if(action==='addUser') $iEr.html('Добавлено в таблицу!');
                if(action==='delUser') $iEr.html('Пользователь удалён!');
                showDataTable([data['value']]);
                break;
            // case 400:
            //     $iEr.html('Получен пустой ответ от сервера либо некорректный ввод.<br>Перезагрузите страницу и повторите ввод');
            //     break;
            // case 404:
            //     $iEr.html('Пока тут ничего нет.<br>Чтобы появился список, добавьте пользователя.');
            //     $('#usersTable').html('');
            //     break;
            // case 500:
            //     $iEr.html('Ошибка на стороне сервера.<br>Перезагрузите страницу и повторите ввод.');
            //     break;
        }
    } catch (e) {
        console.log(data);
    }
}

/**
 * Получает массив и создаёт из него HTML таблицу
 * @param value
 * @returns {string}
 * @param {array} value
 */
function showDataTable(value) {
    //Сборка таблицы
    let text = '';
    $.each(value, function (i, value) {
        text += '<tr><td>' + value['name']+ '</td><td>' + value['email'] + '</td>';
        text += '<td id="btn"><button value="'+value['id']+'" onclick="deletePerson(this)">Удалить</button></td></tr>';
    });
    $('#usersTable').html(text);
}