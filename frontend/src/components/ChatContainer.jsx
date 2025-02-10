import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js';
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import { formatMessageTime } from '../lib/utils.js';
import { Table } from 'lucide-react';


const ChatContainer = () => {
    const {selectedUser, messages, getMessages, isMessageLoading, subscribeToMessages, unsubscribeFromMessages, translateMessage} = useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);
    
    
    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages(); //performance reasons
    }, [getMessages, selectedUser._id, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages])

    const [translate, setTranslate] = useState(false);
    const [translatedMsg, setTranslatedMsg] = useState({
        msgId:"",
        text:""
    }); // because the updates are async we maintain two diff states
    
    const handleTranslation = async (message) => {
        //console.log(message._id, translate);
        const translatedText = await translateMessage(message.text);
        if (!translatedText) return;
        setTranslate(!translate)
        setTranslatedMsg({msgId:message._id, text:translatedText})
    }
    

    if (isMessageLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton/>
            <MessageInput />
      </div>
    )
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                <div
                    key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                    ref={messageEndRef}
                >
                    <div className=" chat-image avatar">
                    <div className="size-10 rounded-full border">
                        <img
                        src={
                            message.senderId === authUser._id
                            ? authUser.profilePic || "/avatar.png"
                            : selectedUser.profilePic || "/avatar.png"
                        }
                        alt="profile pic"
                        />
                    </div>
                    </div>
                    <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                        {formatMessageTime(message.createdAt)}
                    </time>
                    </div>
                    <div className="chat-bubble flex flex-col">
                    {message.image && (
                        <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                        />
                    )}
                    {message.text && translate && translatedMsg.msgId===message._id? <p>{translatedMsg.text}</p> : <p>{message.text}</p>}
                    </div>
                    {authUser?.language && 
                        <div className="chat-footer hover:underline cursor-pointer" onClick={() => {handleTranslation(message)}}> 
                            { translate && translatedMsg.msgId ===message._id ? "back to original" : `Translate to ${authUser.language}` }
                        </div>
                    }
                    
                </div>
                ))}
            </div>
            <MessageInput/>
        </div>
    )
}

export default ChatContainer
