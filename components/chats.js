import { MdDelete } from "react-icons/md"
import { db } from "@/config/firebase"
import { arrayRemove, doc, updateDoc } from "firebase/firestore"

export default function Chats({isUser=true, message, time, currentUser, projectId, isadmin}) {
    const date = new Date(time)
    const addZero = (n) => {
        if (n in [0,1,2,3,4,5,6,7,8,9]){
            return true
        }
        return false
    }
    const deleteMessage = async () => {
        try {
            await updateDoc(doc(db, "chats", projectId),{
                allChats:arrayRemove({
                    messages: message,
                    senderId: currentUser,
                    sendAt: time
                })
            }).then(console.log("message deleted succcessfully"))
        } catch (error) {
            window.alert(error)
        }
    }
    return (
        <>
        {!isUser ? (<div className="flex w-full items-center justify-between">
            <div className="w-3/4">
                <div className={`max-w-fit ${isadmin ? "bg-orange-400 text-white" : "bg-zinc-200" }  rounded p-2 my-2`}>
                    {message}
                </div>
            </div>
            <div>

            </div>
        </div>)
        : (<div className="flex w-full items-center justify-between">
            <div className="w-1/4">
                <div></div>
            </div>
            <div className="flex items-center gap-2">
                <MdDelete onClick={deleteMessage} className="text-zinc-600 opacity-0 transition-opacity ease-in hover:opacity-100" />
                <div className={`flex gap-4 max-w-fit ${isadmin ? "bg-orange-400" : "bg-blue-500"} text-white rounded p-2 mt-2`}>
                    <h3 className="roboto-medium">{message}</h3>
                    <div className="flex items-end"><p className="text-xs text-right">{addZero(date.getHours())? "0"+date.getHours() : date.getHours()}:{addZero(date.getMinutes()) ? "0"+date.getMinutes() : date.getMinutes()}</p></div>
                </div>
            </div>
        </div>    
        )}
        </>
    )
}