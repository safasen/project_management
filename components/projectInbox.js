"use client"
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import ProjectNotification from "./projectNotify";

export default function ProjectInbox({currentProject}){
    const [notification, setNotification] = useState([])
    useEffect(()=> {
        const unsub = onSnapshot(collection(db,"projects",currentProject,"notifications"), (doc) => {
            setNotification(doc.docs)
        })

        return ()=>{unsub()}
    },[currentProject])
    return (
        <>
        <div className="fixed h-screen opens bg-zinc-100 right-0 w-1/4 p-4">
            <h1 className="text-2xl roboto-bold mb-8">Inbox</h1>
            {notification.length !=0 ? notification?.sort((a,b)=> b.data().sendAt - a.data().sendAt).map((k)=> {
                    return <ProjectNotification key={k.id} keys={k.id} type={k.data().type} sendBy={k.data().sendBy} taskname={k.data().taskName} projectId={currentProject} taskId={k.data().taskId} />
                }): (<h1>No notifications</h1>)}
                
        
        </div>
        </>
    )
}