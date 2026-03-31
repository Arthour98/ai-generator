<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversations;
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
        $messages = ChatMessages::where("chat_friends.conversation_id",function($query) use($user_id)
        {
           $q->where("user_id",$user_id); 
        })->get();

        return response()->json(["data"=>$messages]);
    }

public function sendFrientRequest(Request $request)
{
        
        $user_id = $request->input("user_id");
        $invite_id = $request->input("invite_id");

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

        $newConversation = Conversations::create([
            "user1"=>$user_id,
            "user2"=>$invite_id
        ]);

        $conversation=Conversations::where("user1",$user_id)->where("user2",$invite_id)->first();
        $conversation_id = $conversation->id;

        ChatFriends::create([
            "user_id"=>$user_id,
            "friend_id"=>$invite_id,
            "status"=>"pending",
            "conversation_id"=>$conversation_id,
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
                $invitationHandler->status=$choice;
                $invitationHandler->save();
            }

        return response()->json(["message"=>"Invitation handled"]);
    }


    public function sendMessage(Request $request)
    {
        $user_id =  $request->input("user_id");
        $receiver_id = $request->input("receiver_id");
        $message = $request->input("message");

        $conversation = Conversations::whereHas("chat_friends", function($query) use($user_id,$receiver_id)
        {
            $query->where("user_id",$user_id)->where("friend_id",$receiver_id);
        })->get();

        if(!$conversation | is_null($conversation))
            {
                return response()->json(["error"=>"You are not friends with that person"]);
            }
        $conversation_id = $conversation->id;

        $newMessage = ChatMessages::create([
            "friends_conversation"=>$conversation_id,
            "message"=>$message,
            "created_at"=>now(),
            "updated_at"=>now()
        ]);

        if($newMessage)
        {
            return response(401)->json(["succcess"=>true]);
        }
    
    }

    public function deleteFriend(Request $request)
    {
        $user_id = $request->input("user_id");
        $friendship_id= $request->input("friendship_id");

        if(!$user_id) return;

        $friend = ChatFriends::find($friendship_id);
        $friend->delete();

        return response()->json(["message"=>"success"]);
    }

}
