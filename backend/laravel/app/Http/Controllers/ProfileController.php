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
    $image=imageDecoder($request->input("image_profile"),$request->input("user_id"),"profile_images");
    

    $profile=Profile::updateOrCreate(
        ['user_id' => $request->input('user_id')],
        ["nickname"=>$request->input("nickname"),
        "age"=>$request->input("age"),
        "country"=>$request->input("country"),
        "settings"=>'{}',
        "image_profile"=>$image
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

public function update(Request $request)
{
    $id=$request->input('id');
    $image=imageDecoder($request->input("image_profile"),$id,"profile_images");

    $profile=Profile::findOrFail($id);

    if($profile)
    {
        $profile->nickname=$request->input("nickname");
        $profile->age=$request->input("age");
        $profile->country=$request->input("country");
        $profile->image_profile->$image;

        return response(200)->json(["status"=>"success","profile"=>$profile]);
    }
    else
    {
        return response(404)->json(["error"=>"Profile was not found"]);
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



}
