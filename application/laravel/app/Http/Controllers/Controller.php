<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response;

abstract class Controller
{
    /**
     * Получает данные из запроса клиента, возвращает массив
     * @return mixed
     */
    public static function getRequestData(): mixed
    {
        return request()->input('data');
    }
    /**
     * Оформляет массив из входных данных в формат JSON
     * @param $data
     * @param string $status
     * @return JsonResponse
     */
    public static function prepareDataToJSON($data, string $status = ''): JsonResponse
    {
        return Response::json([
            'data' => $data,
            'status' => $status
        ]);
    }
}
