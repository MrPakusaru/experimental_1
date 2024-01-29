<?php                       /*      ТОЧКА ВХОДА К СЕРВЕРУ       */

declare(strict_types=1);

use Experimental_1\BaseClass;

//CORS TODO: добавить в nginx headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range'); // phpcs:ignore
header('Access-Control-Expose-Headers: Content-Length,Content-Range');
//CORS

require __DIR__ . '/../vendor/autoload.php';    //Подключение автозагрузки PHP классов/файлов/т.д.

try {
    echo json_encode((new BaseClass())->getText(), JSON_THROW_ON_ERROR);
} catch (\JsonException $e) {
}
