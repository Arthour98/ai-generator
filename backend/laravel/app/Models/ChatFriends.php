<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class ChatFriends extends Model
{
    protected $fillable = [
        'user_id',
        'friend_id',
        "status",
        "conversation_id"
        ];
    //
    public function user()
    {
        return $this->belongsTo(User::class);
    }
 
}
