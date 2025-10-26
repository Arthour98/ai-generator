<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PixabayController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::get('/user', [AuthController::class, 'user']);
Route::get("/profile",[ProfileController::class,'profile']);
Route::post("/profile/create",[ProfileController::class,'create']);
Route::put("/profile/update",[ProfileController::class,'update']);
Route::post("/profile/settings",[ProfileController::class,"createOrUpdateSettings"]);
Route::post('/pixabay/search', [PixabayController::class, 'search']);