"use client"
import { db } from "@/config/firebase";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { BiSolidSend } from "react-icons/bi";
import Chats from "./chats";
import { useEffect, useRef, useState } from "react";
export default function TeamChat({currentUser, projectId, admin}){
    const [chats,setchats] = useState(null)
    const endRef = useRef(null)
    document.body.scrollIntoView
    useEffect(() => {
        const unsub = onSnapshot(doc(db,"chats",projectId), (doc) => {
            setchats(doc.data())
        })
        return () => {unsub()}
    },[currentUser])

    useEffect(()=> {
        function scroll() {
            scrolling()
        }
        scroll()
    },[chats?.allChats])
    const messageSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const messageData = formData.get("message")
        try {
            await updateDoc(doc(db, "chats",projectId),{
                allChats: arrayUnion({
                    messages: messageData,
                    senderId: currentUser,
                    sendAt: Date.now()
                })
            }).then(e.target.reset())
        } catch (error) {
            window.alert("Cant send message")
        }
    }
    const scrolling = () => {
        window.scrollTo({top: endRef.current?.offsetTop, behavior: "smooth"})
    }
    
    return (
        <>
        <div className="h-12"></div>
        {chats?.allChats?.sort((a,b)=>{b.sendAt - a.sendAt}).map((k)=>{
            return <Chats key={k.sendAt} isUser={k.senderId == currentUser} message={k.messages} time={k.sendAt} currentUser={currentUser} projectId={projectId} isadmin={k.senderId == admin} />
        })}
        <div ref={endRef} className="h-12"></div>
        <div className="fixed p-4 flex  w-2/3 lg:w-3/4 xl:w-4/5 right-0 bottom-0 bg-white">
            <form onSubmit={messageSubmit} className="relative flex items-center w-full">
                <input className="rounded-full bg-zinc-200 w-full" autoComplete="off" type="text" name="message" placeholder="Type your message..." />
                <button type="submit" className="absolute right-0 w-fit border-none rounded-full p-2 mr-2 bg-blue-500"><BiSolidSend color="white"/></button>
            </form>
        </div>
        </>
    )
}