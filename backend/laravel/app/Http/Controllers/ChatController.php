<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ChatFriends;
use App\Models\ChatMessages;

class ChatController extends Controller
{
public function getFriends($id)
{
    $friends = ChatFriends::with(["friends.profile","user.profile"])
    ->where("user_id", $id)
    ->orWhere("friend_id", $id)
    ->get()
    ->map(function ($friend) use ($id) {

        // determine the opposite user
        $profile = $friend->user_id == $id
            ? $friend->friends->profile
            : $friend->user->profile;

        $friend_id = $friend->user_id == $id
            ? $friend->friend_id
            : $friend->user_id;

        return [
            "id" => $friend->id,
            "friend_id" => $friend_id,
            "status" => $friend->status,
            "profile" => $profile,
            "inviter_id" => $friend->user_id
        ];
    });


        if($friends->count()==0)
        {
            return response()->json(["data"=>[]]);
        }
        return response()->json(["data"=>$friends],200);
}
    public function getMessages($id)
    {
        $user_id = $id;
        $messages = ChatFriends::with(["messages"])
        ->where("user_id",$user_id)
        ->orWhere("friend_id",$user_id)
        ->get()
        ->map(function($conversation)
        {
            return
            [
            "messages"=>$conversation->messages
            ];
        });

   

        return response()->json(["data"=>$messages]);
    }

public function sendFrientRequest(Request $request)
{
        $user_id = $request->input("user_id");
        $invite_id = $request->input("invite_id"); //the guy getting invited :p

        //prevent existing friendships to redeclare
        $existingFriends = ChatFriends::where(function($query) use($user_id,$invite_id)
        {
            $query->where("user_id",$user_id)->where("friend_id",$invite_id);
        })->orWhere(function($query) use($user_id,$invite_id)
        {
            $query->where("friend_id",$user_id)->where("user_id",$invite_id);
        })->get();


        if($existingFriends->isNotEmpty())
        {
            return response()->json(["message"=>"failed"],200);
        }

        ChatFriends::create([
            "user_id"=>$user_id,
            "friend_id"=>$invite_id,
            "status"=>"pending",
            'created_at' => now()
        ]);

        return response()->json(["message"=>"sent"],200);
}

    public function acceptFriendRequest(Request $request)
    {
        $user_id = $request->input("user_id");
        $invitation_id = $request->input("friendship_id");
        $choice = $request->input("accept") ==true ? "accepted" : "rejected";

        $invitationHandler = ChatFriends::find($invitation_id);
        if($invitationHandler)
            {
                if($choice == "rejected")
                {
                    $invitation_handler -> delete();
                }
                else
                {
                    $invitationHandler->status=$choice;
                    $invitationHandler->save();
                }

            }
        return response()->json(["message"=>"Invitation handled"]);
    }


    public function sendMessage(Request $request)
    {
        $user_id =  $request->input("user_id");
        $message = $request->input("message");
        $conversation_id = $request->input("conversation_id");

        $newMessage = ChatMessages::create([
            "sender_id"=>$user_id,
            "friends_conversation"=>$conversation_id,
            "messages"=>$message,
            "created_at"=>now(),
            "updated_at"=>now()
        ]);


        if($newMessage)
        {
            $newMessages = ChatMessages::where("friends_conversation",$conversation_id)->get();
            return response()->json(["succcess"=>true,"messages"=>$newMessages],200);
        }
    
    }

    public function deleteFriend(Request $request)
    {
        $user_id = $request->input("user_id");
        $friendship_id= $request->input("friendship_id");
        if(!$user_id) return;

        $friend = ChatFriends::find($friendship_id);
        $friend ->delete();

        return response()->json(["message"=>"success"]);
    }

}
