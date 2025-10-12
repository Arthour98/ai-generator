<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $table = 'profile';
    public $timestamps = false;
    protected $fillable = ['user_id', 'nickname', 'age', 'country','settings','image_profile'];



    // Link back to the user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
