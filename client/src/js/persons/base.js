$(function() {
    //Получить данные с сервера при первой загрузке страницы
    $(document).ready(getDataFirst);

    $('#userForm').submit(function (event) {
        event.preventDefault();             //Не допускает перезагрузку страницы и отменяет стандартное поведение формы
        addPerson($(this));
    });
});

