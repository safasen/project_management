import { db } from "@/config/firebase"
import { useUserStore } from "@/config/userStore"
import { addDoc, collection, getDoc, query, serverTimestamp, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import UserData from "./userData"
import MessageState from "./messageState"

export default function CreateTask({users, currentUser, currentProject}) {
    const [message, setmessage] = useState({
        ismessage : false,
        type: "success",
        message: "Submit form"
    })
    // const getData = async () => {
    //     const userQuery =  query(collection(db, "users"), where("email", "==", uid))
    //     const querySnap = await getDoc(userQuery)
    //     return querySnap
    // }
    // useEffect(() => {
    //     if (uid) {
    //         async function fetchData() {
    //             const data = await getData().then((d) => setusers(d.data()))  
    //         }
    //         fetchData();
    //     }
    // },[])
    
    
    const submitForm = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formDatas = Object.fromEntries(data.entries())
        try {
            await addDoc(collection(db, "projects", currentProject, "tasks"), {
                description : formDatas.taskDesc,
                givenAt : serverTimestamp(),
                givenTo : formDatas.users,
                isCompleted : false,
                isPlanning : formDatas.planning == "true" ? true : false,
                proofReq : formDatas.proofReq == "true" ? true : false,
                priority : formDatas.priority,
                taskName : formDatas.taskName,
                deadline : Timestamp.fromDate(new Date(formDatas.deadline)),
                proof: "",
                proofType: true

            })
            setmessage({ismessage: true, type: "success", message: "Task Created Successfully"})
        } catch (error) {
            window.alert(error.code)
            console.log(error)
        }
        e.target.reset()
}
    return (
        <>
        <div>
            <form onSubmit={submitForm} className="w-1/2 flex flex-col gap-8">
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="taskName">Task Name</label>
                    <input className="col-span-2" name="taskName" placeholder="Task Name"  required/>
                </div>
                <div className="grid grid-cols-3 ">
                    <label className="roboto-medium" htmlFor="taskDesc">Task Description</label>
                    <textarea rows={2} className="col-span-2" type="text" name="taskDesc" placeholder="Task Description" required/>
                </div>
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="deadline">Deadline</label>
                    <div className="col-span-2">
                        <input type="datetime-local" name="deadline"/>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <label className="roboto-medium" htmlFor="cars">Task Given to</label>
                    <div className="col-span-2">
                        <select name="users">
                            {users?.map((k) => {
                                if (k != currentUser){
                                    return <option key={k} value={k}><UserData withEmail={true} connectionInfo={k} /></option>
                                }
                            })}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Priority of the Task</h3>
                    <div className="flex items-center gap-8 col-span-2 justify-center">
                        <div className="flex items-center gap-2">
                            <input type="radio" name="priority" value={1} />
                            <label htmlFor="priority">1</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" name="priority" value={2} />
                            <label htmlFor="priority">2</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" name="priority" value={3} />
                            <label htmlFor="priority">3</label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Is the task being planned?</h3>
                    <div className="flex items-center gap-8 col-span-2 justify-center">
                        <div className="flex items-center gap-2">
                            <input type="radio" name="planning" value={true} />
                            <label htmlFor="planning">Yes</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" name="planning" value={false} />
                            <label htmlFor="planning">No</label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <h3 className="roboto-medium">Is proof of work required?</h3>
                    <div className="flex items-center gap-8 col-span-2 justify-center">
                        <div className="flex items-center gap-2">
                            <input type="radio" name="proofReq" value={true} />
                            <label htmlFor="proofReq">Yes</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="radio" name="proofReq" value={false} />
                            <label htmlFor="proofReq">No</label>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-4">
                    <button className="w-fit" type="submit">Submit</button>
                    <button className="w-fit bg-black text-white" type="reset">Reset</button>
                </div>    
            </form>
            {message.ismessage && <MessageState type={message.type} message={message.message}  />}
        </div>
        </>
    )
}