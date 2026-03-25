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
        $friends = ChatFriends::where("user_id",$user_id)->get();

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
        $invite_id = $request->input("friends_id");

        $invitation = ChatFriends::where("user_id",$user_id)->where("friends_id",$invite_id)->get();
        $invitation-> status ="pending";
        $invitation-> created_at = now();
        $invitation->save();

        return response()->json(json(["message"=>"Inviation sent successfully"]));
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
