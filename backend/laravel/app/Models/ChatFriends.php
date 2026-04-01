<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\ChatMessages;


class ChatFriends extends Model
{
    protected $fillable = [
        'user_id',
        'friend_id',
        "status",
        ];
    //
    public function friends()
    {
        return $this->belongsTo(User::class,"friend_id");
    }

        public function user() {
        return $this->belongsTo(User::class, "user_id");
    }
    public function messages()
    {
        return $this->hasMany(ChatMessages::class,"id");
    }
 
}
