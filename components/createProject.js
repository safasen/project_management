"use client"
import { db } from "@/config/firebase"
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import UserList from "./userList"
import MessageState from "./messageState"

export default function CreateProject({currentUser}){
    const [users, setusers] = useState([])
    const [message, setMessage] = useState({
        ismessage : false,
        type: "success",
        message: "Submit form"
    })
    let userArray = []
    useEffect(()=> {
        async function fetchData(){
            await getDocs(collection(db, "users", currentUser, "connections")).then((user)=>{
                setusers(user.docs)
            })
        }
        fetchData()
    },[])
    // console.log(users)
    const submitForm = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formDatas = Object.fromEntries(data.entries())
        if (userArray.length ==0){
            window.alert("Please add Users in This project!!!")
            return
        }
        try {
            await addDoc(collection(db, "projects"), {
                name: formDatas.projectName,
                createdOn : serverTimestamp(),
                users: [],
                projectStatus : formDatas.status == "active" ? true : false,
                deadline : Timestamp.fromDate(new Date(formDatas.deadline)),
                admin: currentUser

            }).then(async (docs) => {
                await setDoc(doc(db, "chats", docs.id),{
                    allChats: []
                })
                userArray.forEach(async (element)=> {
                    try {
                        await addDoc(collection(db, "users", element, "notifications"),{
                            sendBy: currentUser,
                            sendAt: serverTimestamp(),
                            type: "project",
                            projectId: docs.id
                        })
                    } catch (error) {
                        window.alert("Can't send project Request!!! Please try adding user through edit project")
                    }
                })
            })
            setMessage({ismessage: true, type: "success", message: "Project Created Successfully"})
            
        } catch (error) {
            window.alert("Can't submit...Please try again!!!")
            console.log(error)
        }
        e.target.reset()
}
    return (
        <>
        <form onSubmit={submitForm} className="w-2/3 flex flex-col gap-8">
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="projectName">Project Name</label>
                    <input className="col-span-2" name="projectName" placeholder="Project Name" autoComplete="off" required/>
                </div>
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="deadline">Project Deadline</label>
                    <div className="col-span-2">
                        <input type="datetime-local" name="deadline"/>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Project Team</h3>
                    <div className="col-span-2 ">
                        <div className="max-h-20  border border-black rounded overflow-y-scroll">
                            {users.length != 0 ? users.map((user)=>{
                                return <div key={user.id} onClick={()=> {if (!userArray.includes(user.data().userId)){userArray.push(user.data().userId)}}}><UserList connectionInfo={user.data().userId} /></div>
                            }) :<h1>You have no connections</h1>}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Status</h3>
                    <div className="flex items-center gap-8 col-span-2 ">
                        <div className="flex items-center gap-2">
                            <input type="radio" name="status" value={"active"} />
                            <label htmlFor="status">Active</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" name="status" value={"planning"} />
                            <label htmlFor="status">Planning</label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <button className="w-fit" type="submit">Submit</button>
                    <button className="w-fit bg-black text-white" type="reset">Reset</button>
                </div>    
            </form>
            {message.ismessage && <MessageState type={message.type} message={message.message}  />}
        </>
    )
}