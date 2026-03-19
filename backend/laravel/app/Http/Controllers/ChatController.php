<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversations;
use App\Models\ChatFriends;
use App\Models\ChatMessages;

class ChatController extends Controller
{
    //
    public function getFriends($id)
    {
        $user_id = $id;
        $friends = ChatFriends::where("user_id",$user_id)->get();

        return response()->json($friends)
    }

    public function getMessages($id)
    {
        $user_id = $id;
        $messages = ChatMessages::where("user_id",)
    }

    public function sendFrientRequest(Request $request)
    {

    }

    public function acceptFriendRequest(Request $request)
    {

    }

    public function getFriendRequest($id)
    {

    }

    public function sendMessage(Request $request)
    {

    }

    
}
