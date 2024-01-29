<?php

declare(strict_types=1);

namespace Experimental_1;

/**
 * Основной класс для действий на стороне "сервера"
 */
class BaseClass
{
    //Временный массив для отправления данных на клиент
    public function getText(): array
    {
        return array(
            'code' => 200,
            'value' => [
                'id' => 1,
                'name' => 'ss',
                'email' => 'sss'
            ]
        );
    }
}
