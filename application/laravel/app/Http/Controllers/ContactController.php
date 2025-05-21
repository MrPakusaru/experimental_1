<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    /**
     * Помещает данные запроса в объект Contact, затем возвращает список контактов
     * @return JsonResponse
     */
    public function createContact(): JsonResponse
    {
        $data = self::getRequestData();
        $contact = new Contact();
        $contact->surname = $data['surname_val'];
        $contact->name = $data['name_val'];
        $contact->last_name = $data['last_name_val'];
        $contact->email = $data['email_val'];
        $contact->phone = $data['tel_val'];
        $contact->birth_day = $data['day_val'];
        $contact->birth_month = $data['month_val'];
        $contact->birth_year = $data['year_val'];
        $contact->save();

        return self::prepareDataToJSON(self::getContactsFromDB(), 'success');
    }
    /**
     * Совершает запрос к БД за списком контактов
     * @return Collection
     */
    public static function getContactsFromDB(): Collection
    {
        //return DB::table('contacts')->get();
        return Contact::all();
    }
    /**
     * Возвращает список контактов в JSON формате
     * @return JsonResponse
     */
    public static function getContacts(): JsonResponse
    {
        return self::prepareDataToJSON(self::getContactsFromDB());
    }
    /**
     * Вносит изменения в БД, затем возвращает список контактов
     * @return JsonResponse
     */
    public static function updateContact(): JsonResponse
    {
        $data = self::getRequestData();
        DB::table('contacts')->where('id', $data['id_val'])->update(
            [
                'surname' => $data['surname_val'],
                'name' => $data['name_val'],
                'last_name' => $data['last_name_val'],
                'email' => $data['email_val'],
                'phone' => $data['tel_val'],
                'birth_day' => $data['day_val'],
                'birth_month' => $data['month_val'],
                'birth_year' => $data['year_val'],
            ]
        );
        return self::prepareDataToJSON(self::getContactsFromDB(), 'success');
    }

    /**
     * Удаляет из БД строчку контакта по полученному id, затем возвращает список контактов
     * @return JsonResponse
     */
    public static function deleteContact(): JsonResponse
    {
        $data = self::getRequestData();
        DB::table('contacts')->delete($data['id_val']);
        return self::prepareDataToJSON(self::getContactsFromDB(), 'success');
    }
}
