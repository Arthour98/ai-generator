<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\RefreshToken;

class CheckRefreshToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
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

        // attach user to request (VERY useful)
        $request->attributes->set('user', $tokenData->user);

        return $next($request);
    }
}
