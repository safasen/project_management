import { db } from "@/config/firebase"
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import {AiOutlineUserDelete} from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
export default function UserContainer({keys, connectionId, userId}) {
    const [connectionUser, setConnectionUser] = useState(null)
    useEffect(()=> {
        async function fetchData() {
            const querySnap = await getDoc(doc(db,"users", connectionId)).then((docs)=> setConnectionUser(docs.data()))
        }
        fetchData()
    },[])

    const unfriend = async () => {
        try {
            await deleteDoc(doc(db, "users", userId, "connections", keys)).then(async () =>{
                await getDocs(query(collection(db, "users", connectionId, "connections"), where("userId","==",userId))).then((docs) => {
                    docs.docs.forEach(async (k)=> {
                        await deleteDoc(doc(db, "users", connectionId, "connections", k.id)).then("Successfully Unfriend")
                    })
                })
            })
        } catch (error) {
            window.alert("Cant unfriend")
        }
    }
    return (
        <div className="flex justify-between bg-white items-center p-4 rounded">
            <div className="flex items-center gap-2 text-lg roboto-medium">
                <FaUserCircle />
                <h1>{connectionUser ? connectionUser.name[0].toUpperCase() + connectionUser.name.substring(1) : "Loading"}</h1>
            </div>
            <div className="cursor-pointer text-xl hover:text-red-500" onClick={unfriend}><AiOutlineUserDelete /></div>
        </div>
    )
}