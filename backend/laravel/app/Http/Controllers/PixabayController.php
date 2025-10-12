<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PixabayController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        $response = Http::get('https://pixabay.com/api/', [
            'key' => env('PIXABAY_API_KEY'),
            'q' => $query,
            'image_type' => 'photo'
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Failed to fetch images'], 500);
        }
    }
}
