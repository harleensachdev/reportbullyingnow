import {useEffect, useRef, useState } from "react";
import "./chat.css";
import {
    getDoc,
    doc,
    onSnapshot,
    arrayUnion,
    updateDoc
} from "firebase/firestore";
import {db} from "../../lib/firebase";
import {useChatStore} from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const {currentUser} = useUserStore();
    const {chatId, user,isCurrentUserBlocked, isRecieverBlocked} = useChatStore();

    const endRef = useRef(null)
    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"})
    },[])
    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "chats", chatId), (res)=>{
            setChat(res.data());
        });
        return () => {
            unSub();
        };
    }, [chatId]);

    console.log(chat)


    const handleSend = async() => {
        if (text === "") return;

        try{
            await updateDoc(doc(db, "chats", chatId),{
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });

            const userIds = [currentUser.id, user.id];
            userIds.forEach(async(id)=>{

            
                const userChatsRef = doc(db, "userchats",id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if(userChatsSnapshot.exists()){
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex((c)=>c.chatId===chatId);
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true: false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef,{
                        chats: userChatsData.chats,
                    });
            }
        });

        } catch(err) {
            console.log(err);
        }
        
    };

    console.log(text)
    return (
        <div className= 'chat'>
            <div className= 'top'>
                <div className="user">
                <img src = "./avatar.png" alt ="" />
                <div className= 'texts'>
                    <span>{user?.username}</span>
                </div>
                </div>
            </div>
            <div className= 'center'>
                { chat?.messages?.map((message)=>(
            <div className = {message.senderId === currentUser?.id ? "message own" :"message"} key ={message?.createAt}>
                <div className="texts">
                    <p>{message.text}</p>
                    <span></span>
                </div>
            </div>
                ))}
            <div ref ={endRef}></div>
            </div>

            <div className= 'bottom'>
                <div className = "icons"></div>
                <input
                    type= "text" 
                    placeholder = {(isCurrentUserBlocked || isRecieverBlocked) ? "You cannot send a message": "Type a message..."}
                    value = {text}
                    onChange = {(e) => setText(e.target.value)}
                    disabled = {isCurrentUserBlocked || isRecieverBlocked}
                />
                <button className = 'sendButton' onClick={handleSend} disabled = {isCurrentUserBlocked || isRecieverBlocked}>Send</button>
            </div>
            
        </div>
    )
}

export default Chat