<?php

use Illuminate\Support\Facades\Storage;


if (!function_exists('imageDecoder')) {
function imageDecoder($imageString, $userId, $path = 'images/')
{
    //  Validate and extract image type
   
    if (preg_match('/^data:image\/(\w+);base64,/', $imageString, $type)) {
        $imageType = strtolower($type[1]); // jpg, png, etc.
        $base64String = substr($imageString, strpos($imageString, ',') + 1);
    } else {
        throw new Exception('Invalid base64 image format.');
    }

    // 2️ Decode the base64 string
    $imageData = base64_decode($base64String);
    if ($imageData === false) {
        throw new Exception('Base64 decode failed.');
    }

    // 3️ Create a user-specific folder (e.g. images/123/)
    $userFolder = rtrim($path, '/') . '/' . $userId . '/';
    if (!Storage::disk('public')->exists($userFolder)) {
        Storage::disk('public')->makeDirectory($userFolder);
    }

    // Generate a unique file name
    $fileName = uniqid() . '.' . $imageType;

    //  Full path inside storage
    $filePath = $userFolder . $fileName;

    //  Save image
    Storage::disk('public')->put($filePath, $imageData);

    //  Return public URL (accessible via /storage/...)
    return Storage::url($filePath);
}
}
