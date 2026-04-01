<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChatFriends;


class ChatMessages extends Model
{
    //

    protected $fillable = ["sender_id","friends_conversation","messages"];

    public function friends()
    {
        return $this->belongsTo(ChatFriends::class);
    }

}
