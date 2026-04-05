<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PixabayController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\RadioController;
use App\Http\Controllers\PexelVideoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::get('/user', [AuthController::class, 'user']);
//profiles calls
Route::get("/profile",[ProfileController::class,'profile']);
Route::post("/profile/create",[ProfileController::class,'create']);
Route::put("/profile/update",[ProfileController::class,'update']);
Route::post("/profile/settings",[ProfileController::class,"createOrUpdateSettings"]);
Route::post('/pixabay/search', [PixabayController::class, 'search']);
Route::post("/pixabay/videoSearch",[PixabayController::class, 'searchVideo']);
Route::post("/pexels/videoSearch",[PexelVideoController::class,"searchVideos"]);
// ai api calls
Route::post('/ai/text', [AIController::class, 'textGenerate']);
//radio api calls
Route::get('/radio/countries', [RadioController::class, 'countries']);
Route::get('/radio/tags', [RadioController::class, 'tags']);
Route::post('/radio/country/sel', [RadioController::class, 'byCountry']);
Route::post('/radio/tag/sel', [RadioController::class, 'byTag']);
//user calls
Route::post("/user/edit",[UserController::class,"EditUser"]);


//chat calls
Route::middleware("refresh.token")->group(function()
{
Route::post("/chat/send-friend-request",[ChatController::class,"sendFrientRequest"]);
Route::post("/chat/accept-friend-request",[ChatController::class,"acceptFriendRequest"]);
Route::post("/chat/send-message",[ChatController::class,"sendMessage"]);
Route::get("/chat/friends/{id}",[ChatController::class,"getFriends"]);
Route::get("/chat/messages/{id}",[ChatController::class,"getMessages"]);
Route::post("/profile/searchProfiles",[ProfileController::class,"getSpecificProfile"]);
Route::post("/chat/delete-friend",[ChatController::class,"deleteFriend"]);
Route::post("chat/status-switch",[ChatController::class,"switchStatus"]);
});

