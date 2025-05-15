import { db } from "@/config/firebase"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, serverTimestamp, Timestamp, updateDoc, writeBatch } from "firebase/firestore"
import { useEffect, useState } from "react"
import UserList from "./userList"
import MessageState from "./messageState"

export default function EditProject({projectDetails, projectId, currentUser}){
    const [users, setusers] = useState([])
    const [message, setMessage] = useState({
        ismessage : false,
        type: "success",
        message: "Submit form"
    })
    let userArray = []
    projectDetails.users.forEach((element) => {
        userArray.push(element)
    });
    useEffect(()=> {
        const unsub = onSnapshot(collection(db,"users", currentUser, "connections"), (doc)=> {
            setusers(doc.docs)
        })
        return () => {unsub()}
    },[])
    const submitForm = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formDatas = Object.fromEntries(data.entries())
        try {
            await updateDoc(doc(db,"projects", projectId),{
                name: formDatas.projectName ? formDatas.projectName : projectDetails.name,
                deadline: formDatas.deadline ? Timestamp.fromDate(new Date(formDatas.deadline)) : Timestamp.fromDate(new Date(projectDetails.deadline.toDate())),
                projectStatus: formDatas.status ? (formDatas.status == "active" ? true : false) : projectDetails.projectStatus
            }).then(() => {
                userArray.forEach(async (element)=> {
                    if (!projectDetails.users.includes(element)){
                        await addDoc(collection(db, "users", element, "notifications"),{
                            sendBy: currentUser,
                            sendAt: serverTimestamp(),
                            type: "project",
                            projectId: projectId
                        })
                    }
                })
            }
            )
            setMessage({ismessage: true, type: "success", message: "Project Edited Successfully"})
            e.target.reset()
        } catch (error) {
            window.alert("Can't edit project!!!")
            console.log(error)
        }
    }
    const deleteUser =  (user) => {
        let target = userArray.indexOf(user)
        if (userArray.length == 0){
            return
        }else if (userArray.length == target + 1) {
            userArray.pop()
        }else {
            let temp = userArray[target]
            userArray[target] = userArray[userArray.length - 1]
            userArray[userArray.length - 1] = temp
            userArray.pop()
        }
        
    }
    return (
        <>
        <form onSubmit={submitForm} className="w-2/3 flex flex-col gap-8">
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="projectName">Project Name</label>
                    <input className="col-span-2" name="projectName" placeholder="Project Name" autoComplete="off"/>
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
                            {users.filter((k)=> !projectDetails.users.includes(k.data().userId)).length != 0 ? users.filter((k)=> !projectDetails.users.includes(k.data().userId)).map((user)=>{
                                return <div key={user.id} onClick={()=> {if (!userArray.includes(user.data().userId)){userArray.push(user.data().userId)}}} onDoubleClick={()=>{if (userArray.includes(user.data().userId)){deleteUser(user.data().userId)}}}><UserList forAdd = {true} connectionInfo={user.data().userId} /></div>
                            }) :<h1>You have no connection left</h1>}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Remove Members</h3>
                    <div className="col-span-2 ">
                        <div className="max-h-20  border border-black rounded overflow-y-scroll">
                            {projectDetails.users.length != 0 ? projectDetails.users.map((user)=>{
                                return <div key={user} onClick={()=> {deleteUser(user)}} onDoubleClick={()=> {if (!userArray.includes(user)){userArray.push(user)}}}><UserList forAdd= {false} connectionInfo={user} /></div>
                            }) :<h1>There are no Team Members</h1>}
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