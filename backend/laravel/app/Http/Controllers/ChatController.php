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
    $user_id = $id;
    $friends = ChatFriends::with(["user.profile"])
    ->where("user_id", $user_id)
    ->get()
    ->map(function ($friend) {
        return [
            // "id" => $friend->id,
            // "user_id" => $friend->user_id,
            // "friend_id" => $friend->friend_id,
            // "conversation_id" => $friend->conversation_id,
            // "status" => $friend->status,
            // "created_at" => $friend->created_at,
            // "updated_at" => $friend->updated_at,
            "profile" => $friend->user->profile
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
            return response()->json(["message"=>"Already friends or request sent"],200);
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

        return response()->json(["message"=>"Inviation sent successfully"]);
    }

    public function acceptFriendRequest(Request $request)
    {
        $user_id = $request->input("user_id");
        $invitation_id = $request->input("invitation_id");
        $choice ->$request->input("invitation_choice");

        $invitationHandler = ChatFriends::where("id",$invitation_id)->get();
        $invitationHandler->status=$choice;
        $invitationHandler->updated_at = now();
        $inviationHandler->save();

        return response()->json(json(["message"=>"Invitation handled"]));
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

 
}
