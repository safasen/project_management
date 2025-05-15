import { db } from "@/config/firebase";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { MdPersonAdd } from "react-icons/md";
import UserContainer from "./userContainer";

export default function Connection({userId}){
    const [adduser, setAdd] = useState(false)
    const [user,setuser] = useState([])
    const [connection, setConnections] = useState([])
    useEffect(()=> {
        const unsub = onSnapshot(collection(db,"users",userId,"connections"), (doc) => {
            setConnections(doc.docs)
        })

        return ()=>{unsub()}
    },[userId])
    const adduserFunc = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const formDatas = formData.get("user")
        try {
            const querySnap = await getDocs(query(collection(db, "users"), where("email", "==", formDatas))).then((doc)=> setuser(doc.docs))
        } catch (error) {
            window.alert("cant search")
            console.log(error)
        }
    }

    const add = async () => {
        if (user.length !=0){
            try {
                await addDoc(collection(db, "users", user[0].data().userId, "notifications"),{
                    sendBy: userId,
                    sendAt: serverTimestamp(),
                    type: "connect"
                })
            } catch (error) {
                window.alert("Can't Send request right now!!")
            }
            
        }
    }
    return (
        <>
        <div className="fixed h-screen opens bg-zinc-100 right-0 w-1/4 p-4">
            <div className="flex items-center justify-between roboto-bold text-2xl mb-8">
                <h1>Connections</h1>
                <MdPersonAdd className="cursor-pointer" onClick={()=> setAdd(!adduser)}/>
            </div>
            {adduser && (
                <form onSubmit={adduserFunc} className="flex flex-col gap-2">
                    <input className="w-full" type="text" placeholder="Type Email Here" name="user" autoComplete="off" required/>
                    <button type="submit">Search</button>
                </form>
            )}
            {adduser && (user[0] ? 
            <div className="flex items-center justify-between p-4 bg-white text-lg roboto-medium my-2 mb-6 rounded">
                <div>
                    {user[0]?.data().name[0].toUpperCase() + user[0]?.data().name.substring(1)}
                    <h3 className="text-base roboto-light">{user[0]?.data().email}</h3>
                </div>
                {connection.filter((t)=> t.data().userId == user[0]?.data().userId).length == 0 && <MdPersonAdd onClick={add} />}
            </div> 
            :<div className="text-center p-2">No user exist</div>)}
            <div className="flex flex-col gap-2">
                {connection[0] ? connection.map((k)=>{
                    return <UserContainer key={k.id} keys={k.id} connectionId={k.data().userId} userId={userId} />
                }): <h1 className="text-center">No Connections</h1>}
            </div>
        
        </div>
        </>
    )
}