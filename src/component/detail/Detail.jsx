import "./detail.css";
import{auth, db} from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { arrayRemove, doc, updateDoc, arrayUnion } from "firebase/firestore";
const Detail = () => {

    const {chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock} = useChatStore();
    const { currentUser } = useUserStore();
    const handleBlock = async() =>{
        if (!user) return;
        const userDocRef = doc(db, "users", currentUser.id)

        try{
            await updateDoc(userDocRef,{
                blocked: isRecieverBlocked? arrayRemove(user.id): arrayUnion(user.id),

            });
            changeBlock()
        } catch(err){
            console.log(err)
        }

    

    };
    return (
        <div className= 'detail'>
            <div className = "user">
                <img src="./avatar.png"alt=""/>
                <h2>{user?.username}</h2>
            </div>
            <div className ="info">
                <div className = "option">
                    <div className = "title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png"alt=""/>
                        
                    </div>
                </div>
            </div>
            <div className ="info">
                <div className = "option">
                    <div className = "title">
                        <span>Privacy % help</span>
                        <img src="./arrowUp.png"alt=""/>
                        
                    </div>
                </div>
            </div>
            <button onClick = {handleBlock}>{ isCurrentUserBlocked ? "You are Blocked" : isRecieverBlocked ? "User Blocked" : "Block User"}</button>
            <div>
            <button className = "logout"onClick={()=>auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}

export default Detail