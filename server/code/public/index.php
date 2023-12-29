<?php
/*      ТОЧКА ВХОДА К СЕРВЕРУ       */

//CORS TODO: добавить в nginx headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
header('Access-Control-Expose-Headers: Content-Length,Content-Range');
//CORS

//Временный массив для отправления данных на клиент
if (
    isset($_POST)
) {
    try {
        $usersArr = array(
            'code' => 200,
            'value' => [
                'id' => 1,
                'name' => 'ss',
                'email' => 'sss'
            ]
        );
        echo json_encode($usersArr,JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        echo '{"error":"JsonException"}';
    }
}