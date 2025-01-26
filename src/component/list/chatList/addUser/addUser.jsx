import "./addUser.css";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  serverTimestamp,
  updateDoc,
  where,
  arrayUnion,
} from "firebase/firestore";
import { useState } from "react";
import { getDocs, doc, setDoc } from "firebase/firestore";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [added, setAdded] = useState(false); // Added state to track if user is added
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setAdded(false); // Reset added state if user found
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          recieverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      setAdded(true); // Set added state to true after successful addition
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Username (only add once)"
          name="username"
        />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={"./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} disabled={added}>
            {added ? "Added" : "Add User"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
