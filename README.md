# Проект "experimental_1"
## Напоминалка:
Перед разработкой этого проекта на другом устройстве сделать эти шаги:
+ Создать файл .env
+ В файле env определить значения для:
  * `ENV_TZ=`
  * `ENV_MYSQL_ROOT_PASSWORD=`
  * `ENV_MYSQL_DATABASE=`
  * `ENV_MYSQL_USER=`
  * `ENV_MYSQL_PASSWORD=`
## В проекте три ветки:
- Main - основная ветка. Там будут появляться только большие и стабильные обновления.
- TEMP - ветка-черновик. Иногда используется для синхронизации кода между устройствами. Там появляются новые кусочки функционала в сыром и приготовленновм виде одновременно. Лезть только если понятно, что происходит...
- NewCode - ветка-чистовик. Всё, что более-менее стабильно, но нормально работает, попадает туда.
## Остальное:
### На случаи бед с Laravel:
>Если случится `file_put_contents(.../laravel/storage/framework/views/абырвалг.php): Failed to open stream: No such file or directory`
>
>Тогда напиши `php artisan view:cache`

>Если не будет работать `Controller::where()`
>
>Тогда напиши `composer require --dev barryvdh/laravel-ide-helper`,
>а затем `php artisan ide-helper:models`