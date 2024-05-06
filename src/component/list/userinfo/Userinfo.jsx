import "./userInfo.css"
import{auth, db} from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import { arrayRemove, doc, updateDoc, arrayUnion } from "firebase/firestore";
const Userinfo = () => {
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
        <div className= 'userInfo'>
            <div className = "user">
                <img src = {"./avatar.png"}  alt = "" />
                <h2> {currentUser.username} </h2>
            </div>
            <div className = "icons">

            </div>
            <div>
            <button className = "logout"onClick={()=>auth.signOut()}>Logout</button>
            
            
            </div>
            
        </div>
    )
}

export default Userinfo