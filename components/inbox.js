"use client"
import { useEffect, useState } from "react";
import Notification from "./notify";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Inbox({userId}){
    const [notification, setNotification] = useState([])
    useEffect(()=> {
        const unsub = onSnapshot(collection(db,"users",userId,"notifications"), (doc) => {
            setNotification(doc.docs)
        })

        return ()=>{unsub()}
    },[userId])
    return (
        <>
        <div className="fixed h-screen opens bg-zinc-100 right-0 w-1/4 p-4">
            <h1 className="text-2xl roboto-bold mb-8">Inbox</h1>
            {notification.length !=0 ? notification?.sort((a,b)=> b.data().sendAt - a.data().sendAt).map((k)=> {
                    return <Notification key={k.id} keys={k.id} userId={userId} type={k.data().type} sendBy={k.data().sendBy} projectId={k.data().type == "project" ? k.data().projectId : null} />
                }): (<h1>No notifications</h1>)}
                
        
        </div>
        </>
    )
}