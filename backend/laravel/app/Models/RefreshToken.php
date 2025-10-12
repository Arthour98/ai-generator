<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    protected $fillable = ['user_id', 'token', 'expires_at'];

    // Cast expires_at to a datetime
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // Link back to the user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
