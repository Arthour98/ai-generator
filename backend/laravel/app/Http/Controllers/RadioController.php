<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class RadioController extends Controller
{
    private string $baseUrl = 'https://de1.api.radio-browser.info/json';

    /**
     * Get all countries
     */
    public function countries()
    {
        // Cache the raw data, not the response object
        $countries = Cache::remember('radio_countries', 86400, function () {
            $response = Http::withHeaders([
                'User-Agent' => 'LaravelRadioClient/1.0',
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/countries");

            if ($response->ok()) {
                return $response->json(); // raw array only
            }

            return []; // return empty array on failure
        });

        return response()->json(["countries"=>$countries]); // wrap after cache
    }

    /**
     * Get all tags
     */
    public function tags()
    {
        $tags = Cache::remember('radio_tags', 86400, function () {
            $response = Http::withHeaders([
                'User-Agent' => 'LaravelRadioClient/1.0',
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/tags");

            if ($response->ok()) {
                return $response->json();
            }

            return [];
        });

        return response()->json(["tags"=>$tags]);
    }

    /**
     * Get stations by country
     */
    public function byCountry(Request $request)
    {
        $country=$request->input("country");

        $stations = Http::withHeaders([
            'User-Agent' => 'LaravelRadioClient/1.0',
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/stations/bycountry/" . urlencode($country));

        if ($stations->ok()) {
            return response()->json(["data"=>$stations->json()]);
        }

        return response()->json([], $stations->status());
    }

    /**
     * Get stations by tag
     */
    public function byTag(Request $request)
    {
        $tag=$request->input("tag");
        $stations = Http::withHeaders([
            'User-Agent' => 'LaravelRadioClient/1.0',
            'Accept' => 'application/json',
        ])->get("{$this->baseUrl}/stations/bytag/" . urlencode($tag));

        if ($stations->ok()) {
            return response()->json(["data"=>$stations->json()]);
        }

        return response()->json([], $stations->status());
    }
}
