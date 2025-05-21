<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed|string $surname
 * @property mixed|string $name
 * @property mixed|string $last_name
 * @property mixed|string $email
 * @property mixed|string $phone
 * @property mixed|string $birth_day
 * @property mixed|string $birth_month
 * @property mixed|string $birth_year
 * @property int $id
 */
class Contact extends Model
{
    public $timestamps = false;
    //
}
