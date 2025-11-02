<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
public function textGenerate(Request $request)
{
    $request->validate(['prompt' => 'required|string']);

    $response = Http::post(
        'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' . env('GEMINI_API_KEY'),
        [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $request->prompt]
                    ]
                ]
            ]
        ]
    );

    $data = $response->json();
    
    return response()->json(['answer' => $data]);
}
}