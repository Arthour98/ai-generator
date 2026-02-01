<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;



class PexelVideoController extends Controller
{
    public function searchVideos(Request $request)
    {
        $query = $request->input("videoQuery");
        $response = Http::withHeaders([
        'Authorization' => config('services.pexels.key'),
        ])->get("https://api.pexels.com/videos/search", [
        "query" => $query,
        'per_page' => 80, 
        ]);

        if($response->successful())
            {
                $results = $response->json();
                $limitedVideos = array_slice($results["videos"],0,100);
                $results["videos"] = $limitedVideos;
                $results["lengthArr"] = sizeof($results["videos"]);
                return response()->json($results);
            }
            else
            {
                return response()->json([
                'error' => 'failed to fetch videos',
                'status' => $response->status(),
                'body' => $response->body()
            ], 500);
            }
    }
}
