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

//user calls
Route::post("/user/edit",[UserController::class,"EditUser"]);
Route::post('/register', [AuthController::class, 'register'])->middleware("throttle:3,1");
Route::post('/login', [AuthController::class, 'login'])->middleware("throttle:5,1");
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('throttle:7,1');
Route::get('/user', [AuthController::class, 'user']);

//profiles calls
Route::get("/profile",[ProfileController::class,'profile']);
Route::post("/profile/create",[ProfileController::class,'create']);
Route::post("/profile/update",[ProfileController::class,'update']);
Route::post("/profile/settings",[ProfileController::class,"createOrUpdateSettings"]);
Route::get("/profile-view/{id}",[ProfileController::class,"viewProfile"]);

//pixabay api calls
Route::post('/pixabay/search', [PixabayController::class, 'search'])->middleware("throttle:30,1");
Route::post("/pixabay/videoSearch",[PixabayController::class, 'searchVideo'])->middleware("throttle:20,1");
Route::post("/pexels/videoSearch",[PexelVideoController::class,"searchVideos"])->middleware("throttle:20,1");
// ai api calls
Route::post('/ai/text', [AIController::class, 'textGenerate'])->middleware("throttle:10,1");
//radio api calls
Route::get('/radio/countries', [RadioController::class, 'countries']);
Route::get('/radio/tags', [RadioController::class, 'tags']);
Route::post('/radio/country/sel', [RadioController::class, 'byCountry'])->middleware("throttle:15,1");
Route::post('/radio/tag/sel', [RadioController::class, 'byTag'])->middleware("throttle:15,1");



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

