$( function () {
    $('#add').on('click',function () {
        //event.preventDefault();             //Не допускает перезагрузку страницы и отменяет стандартное поведение формы
       // let text = '<div';



        $(this).parent().html('<div id="rect"><input type="text" autocomplete="name"/><input type="text" autocomplete="name"/></div>');
    });
});
//TODO сделать сначала макеты объектов, а потом жс скрипты для их превращения