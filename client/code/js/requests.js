const req = {
    addrServer: 'http://127.0.0.1:82/',                 //TODO: попробовать сменить адрес
    dataType: 'json',                                   //Тип данных, которые следует ожидать от сервера
    contentType:'application/json; charset=utf-8'       //При отправке на сервер используется этот тип данных
};

/**
 * Отправляет серверу запрос с получением данных.
 * Ответ сервера передаёт в обработку
 */
function getDataFirst() {
    $.ajax({
        type: 'POST',
        url: req.addrServer,
        data: { getUsers: 'true' },
        dataType: req.dataType,
        contentType: req.contentType,
        success: function (response) {
            handlerOfResponses(response);
        },
        error:function(_,eTS,errorThrown) { console.log('errorThrown: '+errorThrown) }
    });
}

/**
 * Сериализует данные формы в JSON и отдаёт их серверу.
 * Ответ сервера передаёт в обработку
 * @param data
 */
function addPerson(data) {
    $.ajax({
        url: req.addrServer,
        type: 'POST',
        data: JSON.stringify(data),      //Сериализация данных из формя в JSON
        dataType: req.dataType,
        contentType:req.contentType,
        success: function (response) {
            handlerOfResponses(response, 'addUser');
        },
        error:function(_,eTS,errorThrown) { console.log('errorThrown: '+errorThrown) }
    })
}

/**
 * Выполняется при нажатии на кнопку 'Удалить'
 * Посылает запрос на сервер для удаления строки user
 * Ответ сервера передаёт в обработку
 * @param button
 */
function deletePerson(button) {
    $.ajax({
        url: req.addrServer,
        type: 'POST',                          //TODO
        data: {
            delUser: 'true',
            id: button.value
        },
        dataType: req.dataType,
        contentType:req.contentType,
        success: function (response) {
            handlerOfResponses(response, 'delUser');
        },
    })
}