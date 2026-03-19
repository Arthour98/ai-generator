<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChatFriends;
use App\Models\ChatMessages;

class Conversations extends Model
{
    //
    public function friends()
    {
       return  $this->belongsTo(ChatFriends::class);
    }
    
    public function chatMessages()
    {
        return $this->hasMany(ChatMessages::class);
    }
}
