<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Hash;
use App\Models\Profile;

class  AuthController extends Controller
{

    public function login(Request $request)
    {
        try {
            // Validate request
            $request->validate([
                'name' => 'required|string',
                'password' => 'required|string'
            ]);

            // Find user
            $user = User::where('name', $request->input('name'))->first();

            if (!$user || !Hash::check($request->input('password'), $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            // Generate access token
            $accessToken = bin2hex(random_bytes(32));
            $refreshToken = null;

            // Attempt to create refresh token safely
            try {
                if (method_exists($user, 'refresh_tokens')) {
                    $user->refresh_tokens()->delete(); // delete old tokens
                    $refreshToken = bin2hex(random_bytes(64));
                    $user->refresh_tokens()->create([
                        'token' => $refreshToken,
                        'expires_at' => now()->addDays(30),
                    ]);
                }
            } catch (\Throwable $e) {
                Log::error('Refresh token creation failed', ['error' => $e->getMessage()]);
                $refreshToken = null;
            }
            
            Profile::updateOrCreate(["user_id"=>$user->id],
            [
                "status_activity"=>"online"
            ]);

            // Prepare JSON response
            $response = response()->json([
                "user" => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'access_token' => $accessToken,
                'expires_in' => 900
            ]);

            // Attach cookie if refresh token exists
            if ($refreshToken) {
                    return response()->json([
                    "user" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                ],
])->cookie(
    'refresh_token', $refreshToken, 60*24, null, true, true, false,"None"
);
            }

  

            return $response;

        } catch (\Throwable $e) {
            Log::error('Login error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Server error'], 500);
        }
    }


    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'No refresh token'], 401);
        }

        $tokenData = RefreshToken::where('token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$tokenData) {
            return response()->json(['error' => 'Invalid or expired refresh token'], 401);
        }

        $user = $tokenData->user;

        $accessToken = bin2hex(random_bytes(32));

        return response()->json([
            'access_token' => $accessToken,
            'expires_in' => 900
        ]);
    }

public function user(Request $request)
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


    return response()->json([
        'id'    => $user->id,
        'name'  => $user->name,
        'email' => $user->email,
    ]);
}


    // Logout user
    public function logout(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        $session = RefreshToken::where('token', $refreshToken)->first();
        $session->delete();
        

        Profile::updateOrCreate(["user_id"=>$session->user_id],
            [
                "status_activity"=>"offline"
            ]);

        return response()->json(['message' => 'Logged out'])
            ->cookie('refresh_token', '', -1, '/');
    }

    public function register(Request $request)
    {
       $refreshToken = null;
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);
        
        if($user)
        {
        $refreshToken = bin2hex(random_bytes(64));
        $user->refresh_tokens()->create([
                        'token' => $refreshToken,
                        'expires_at' => now()->addDays(30),
                    ]);
        }

        if(!$user) {
            return response()->json(['message' => 'Registration failed'], 500);
        }
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201)->cookie(
        'refresh_token', $refreshToken, 60*24, null, true, true, false,"None"
        );
    }
}
