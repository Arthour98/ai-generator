<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    //
public function profile(Request $request)
{
 $userId = $request->query('user_id');

 $profile=Profile::where('user_id',$userId)->first();

    if($profile)
    {
        return response()->json(["profile"=>$profile],200);
    }
    else
    {
        return response()->json(["error"=>"there is profile for current user"],404);
    }
}

public function create(Request $request)
{
    $user_id = $request -> input("user_id");
    $image=null;
    try
    {
    if(str_starts_with($request->input("image_profile"),"/storage/"))
    {
        $image = $request->input("image_profile");
    }
    elseif($request->input("image_profile") == "")
    {
        $image="";
    }
    else
    {
        $image=imageDecoder($request->input("image_profile"),$user_id,"profile_images");
    }


    $existing_profile = Profile::where("user_id",$user_id)->first();
    if($existing_profile)
    {
        return;
    }

    $profile=Profile::create([
        'user_id' => $request->input('user_id'),
        "nickname"=>$request->input("nickname"),
        "age"=>$request->input("age"),
        "country"=>$request->input("country"),
        "settings"=>'{}',
        "image_profile"=>$image,
        "status_activity"=>"online"
    ]);

    if($profile)
    {
        return response(200);
    }
    else
    {
        return response(404);
    }
    }
    catch (\Throwable $e) {
            Log::error('upload err', ['error' => $e->getMessage()]);
                return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
        }

}

public function update(Request $request)
{
    $id=$request->input('id');
    $user_id = $request -> input("user_id");
    $image=null;
    try
    {
    if(str_starts_with($request->input("image_profile"),"/storage/"))
    {
        $image = $request->input("image_profile");
    }
    elseif($request->input("image_profile") == "")
    {
        $image="";
    }
    else
    {
        $image=imageDecoder($request->input("image_profile"),$user_id,"profile_images");
    }


    $profile=Profile::findOrFail($id);

    if($profile)
    {
        $profile->nickname=$request->input("nickname");
        $profile->age=$request->input("age");
        $profile->country=$request->input("country");
        $profile->image_profile->$image;
        $profile->$user_id = $profile->user_id;
        $profile->status_activity = $profile->status_activity;
        $profile->settings = $profile->settings ?? null;
        $profile->save();
        return response(200)->json(["status"=>"success","profile"=>$profile]);
    }
    else
    {
        return response(404)->json(["error"=>"Profile was not found"]);
    }
    }
        catch (\Throwable $e) {
            Log::error('upload err', ['error' => $e->getMessage()]);
                return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 500);
        }
    
}

public function createOrUpdateSettings(Request $request)
{
    $id=$request->input('user_id');

    $payload=([
        "matrix"=>$request->input('matrix'),
        "background_color"=>$request->input("background_color"),
        "text_color"=>$request->input("text_color")

    ]);

    $profile=Profile::findOrFail($id);
    $profile->settings=$payload;
    $profile->save();
    if($profile)
    {
        return response()->json(["profile"=>$profile]);
    }
}

public function getSpecificProfile(Request $request)
{
    $username = $request->input("username");

    $profiles = Profile::where("nickname","like","%".strtolower($username)."%")->
    orWhere("nickname",'like',"%".strtoupper($username)."%")->get();

    if(!$profiles)
    {
    return response()->json(["message"=>"No profile was found with the specific name"],403);
    }
    if($profiles)
    {
        return response()->json(["profiles"=>$profiles],200);
    }
}

 public function viewProfile($id)
 {
    $profile = Profile::find($id);
    if($profile)
        {
            return response()->json(["profile"=>$profile]);
        }
        else
            {
                return response()->json(["profile"=>[]]);
            }
 }

}
