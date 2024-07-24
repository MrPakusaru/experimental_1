$(function() {
    let jQs = {
        day: $('input[name="day"]'),
        month: $('select[name="month"]'),
        year: $('input[name="year"]'),
        all:$('input[name="day"], select[name="month"], input[name="year"]')
    };

    if (jQs.month.val()==='none') console.log('jQs.month.val()');

    jQs.all.on('input',function (e) {

        console.log(jQs.month.val());
        if (jQs.month.val()==='none') console.log('jQs.month.val()');

        if(jQs.year.val()!=='' && jQs.month.val()!=='' && jQs.day.val()!=='') {
            console.log([jQs.year.val(),jQs.month.val(),jQs.day.val()]);
            console.log(
                new Date(
                    jQs.year.val().toString() + ' '
                    + jQs.month.val() + ' '
                    + jQs.day.val().toString()
                )
            );

        }
    });
});


//TODO сделать валидацию даты


