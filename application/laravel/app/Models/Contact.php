<?php

namespace App\Models;

use Eloquent;
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
 * @mixin Eloquent
 */
class Contact extends Model
{
    public $timestamps = false;
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'surname',
        'name',
        'last_name',
        'email',
        'phone',
        'birth_day',
        'birth_month',
        'birth_year',
        'id'
    ];
}
