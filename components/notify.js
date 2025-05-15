import { db } from "@/config/firebase"
import { addDoc, arrayUnion, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import {FaUserFriends} from "react-icons/fa"
import { GrProjects } from "react-icons/gr"
import UserData from "./userData"

export default function Notification({keys, type="connect", sendBy, userId, projectId}){
    const accept = async () => {
        try {
            await addDoc(collection(db,"users", userId, "connections"),{
                userId: sendBy,
                friendAt: serverTimestamp()
            })
            await addDoc(collection(db,"users", sendBy, "connections"),{
                userId: userId,
                friendAt: serverTimestamp()
            }).then(async ()=> {
                await deleteDoc(doc(db,"users",userId, "notifications", keys))
            }).then(console.log("Accepted Successfuly"))
            
        } catch (error) {
            window.alert("Cant accept")
        }
    }

    const acceptProject = async () => {
        try {
            await updateDoc(doc(db, "projects", projectId),{
                users: arrayUnion(userId)
            }
            
            ).then(async ()=> {
                await deleteDoc(doc(db,"users",userId, "notifications", keys))
            }).then(console.log("You are added to the project"))
        } catch (error) {
            window.alert("High Server Load!!!")
        }
    }
    const reject = async () => {
        try {
            await deleteDoc(doc(db,"users",userId, "notifications", keys)).then(console.log("successfully rejected"))
        } catch (error) {
            window.alert("Cant reject")
        }
    }
    return (
        <>
        {type == "connect" ? (
            <div className="flex flex-col gap-2 rounded p-2 bg-white">
                <h3 className="flex items-center gap-2 roboto-medium"><FaUserFriends color="blue"/>Connect Request</h3>
                <p className="roboto-light"><UserData connectionInfo={sendBy} /> wants to connect with you</p>
                <div className="flex items-center gap-2 roboto-medium text-white mt-4">
                    <div className="cursor-pointer py-2 px-4 bg-blue-500 rounded" onClick={accept}>Accept</div>
                    <div className="cursor-pointer py-2 px-4 bg-red-500 rounded" onClick={reject} >Reject</div>
                </div>
            </div>
        )
        : <div className="flex flex-col gap-2 rounded p-2 bg-white">
            <h3 className="flex items-center gap-2 roboto-medium"><GrProjects color="blue"/>Project Invite</h3>
            <p className="roboto-light"><UserData connectionInfo={sendBy} /> wants to invite you in their Project</p>
            <div className="flex items-center gap-2 roboto-medium text-white mt-4">
                <div className="cursor-pointer py-2 px-4 bg-blue-500 rounded" onClick={acceptProject}>Accept</div>
                <div className="cursor-pointer py-2 px-4 bg-red-500 rounded" onClick={reject} >Reject</div>
            </div>
        </div>}
        </>
    )
}