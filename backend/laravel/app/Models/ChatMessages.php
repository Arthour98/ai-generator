<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChatFriends;


class ChatMessages extends Model
{
    //
    public function friends()
    {
        return $this->belongsTo(ChatFriends::class);
    }

}
