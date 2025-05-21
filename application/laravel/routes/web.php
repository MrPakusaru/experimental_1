<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

//Выдача токена сессии
Route::get('/csrf-token', function () {
    return response()->json([
        'X-CSRF-TOKEN' => csrf_token() // Генерируем и возвращаем CSRF-токен
    ]);
});
//В случае прямого запроса
Route::get('/', fn () => view('welcome'));
//Получение списка контактов
Route::get('/contacts', [ContactController::class, 'getContacts']);
//Добавление нового контакта
Route::post('/contact/new', [ContactController::class, 'createContact']);
//Обновление контакта
Route::put('/contact', [ContactController::class, 'updateContact']);
//Удаление контакта
Route::delete('/contact', [ContactController::class, 'deleteContact']);
