<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Conversations;

class ChatMessages extends Model
{
    //
    public function conversations()
    {
        return $this->belongsTo(Conversations::class);
    }
}
