import { useEffect, useRef, useState } from "react";
import "./chat.css";
import {
  getDoc,
  doc,
  onSnapshot,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import Popup from "../popup/popup";
import BullyingReportForm from "../popup/bullyingreportform";

const Chat = () => {
  const [chat, setChat] = useState();
  const [text, setText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock } =
    useChatStore();

  const endRef = useRef(null);

  // Check if popup has been shown before
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(`popupShown_${currentUser?.id}`);
    if (hasSeenPopup === "true") {
      setIsPopupOpen(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });

      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const hasSeenPopup = localStorage.getItem(`popupShown_${currentUser?.id}`);

    // Show popup only if it hasn't been shown before
    if (newText.length === 1 && hasSeenPopup !== "true") {
      setIsPopupOpen(true);
    }

    setText(newText);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    // Mark popup as shown for this user
    localStorage.setItem(`popupShown_${currentUser?.id}`, "true");
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>{user?.username}</span>
          </div>
          <div>
            <button onClick={handleBlock}>
              {isCurrentUserBlocked
                ? "You are Blocked"
                : isRecieverBlocked
                ? "User Blocked"
                : "Block User"}
            </button>
          </div>
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              <p>{message.text}</p>
              <span></span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons"></div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isRecieverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={handleTextChange}
          disabled={isCurrentUserBlocked || isRecieverBlocked}
        />
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isRecieverBlocked}
        >
          Send
        </button>
      </div>

      {/* Popup that appears when user starts typing */}
      {isPopupOpen && (
        <Popup OpenPopup={isPopupOpen} setOpenPopup={handlePopupClose}>
          <BullyingReportForm setOpenPopup={handlePopupClose} />
        </Popup>
      )}
    </div>
  );
};

export default Chat;
