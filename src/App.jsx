import { useState, useEffect } from "react";
import Chat from "./component/chat/Chat";
import List from "./component/list/List";
import Login from "./component/login/Login";
import Notification from "./component/notification/Notification";
import Popup from "./component/popup/popup"; // Assuming you have Popup component
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  useEffect(() => {
    // Trigger the popup after the page has mounted
    if (!isLoading) {
      setTimeout(() => {
        setShowPopup(true); // Show the popup after the page loads
      }, 500); // Delay to ensure the container is rendered before the popup
    }

    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, isLoading]);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {/* Show popup if the condition is met */}
          {showPopup && <Popup onClose={handlePopupClose} />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
