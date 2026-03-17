<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\RefreshToken;

class UserController extends Controller
{
    

    public function EditUser(Request $request)
    {
    $refreshToken = $request->cookie('refresh_token');
    if (!$refreshToken) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $tokenData = RefreshToken::where('token', $refreshToken)
        ->where('expires_at', '>', now())
        ->first();

    if (!$tokenData) {
        return response()->json(['message' => 'Invalid or expired refresh token'], 401);
    }

    $user = $tokenData->user;

    if (!$user) {
    return response()->json([
        "error" => "User not authenticated"
    ], 401);
}
    $validator = Validator::make($request->all(),
    [
    "username"=>"required|min:4|string",
    "email"=>"required|string",
    "password"=>"nullable|min:4|string"
    ]);

    if($validator->fails())
    {
        return response()->json(["Error"=>"Error occured while editing your credentials"]);
    }

    $data = $validator->validated();

    $user->name = $data["username"];
    $user->email = $data["email"];
    $user->password =$data["password"] !=null ? Hash::make($data["password"]) : $user->password ;
    $user->save();

    return response()->json([
        "user" => [
            "id" => $user->id,
            "name" => $user->name,
            "email" => $user->email
        ]
    ]);
    }
}
