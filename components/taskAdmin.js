"use client"
import { FaEdit } from "react-icons/fa"
import { MdDelete, MdDescription, MdOutlineUpdate } from "react-icons/md"
import { dateConv } from "./dateConv"
import { useState } from "react"
import { collection, deleteDoc, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "@/config/firebase"
import { RxCross2 } from "react-icons/rx"

export default function TaskAdmin({keys,currentProject, priority, deadline, isCompleted, taskName, taskDesc, proofReq, isPlanning, proofDoc=null, proofType=false}){
    const [editIcon, seteditIcon] = useState(false)
    const [proofSee, setproofSee] = useState(false)
    const prioritycolor = (prior) => {
        if (prior == "1"){
            return "border-red-500"
        }else if (prior == "2"){
            return "border-yellow-500"
        }else {
            return "border-green-500"
        }
    }
    const statusColor = prioritycolor(priority)
    let date;
    if (deadline){
        date = dateConv(deadline.getDate(), deadline.getMonth() + 1, deadline.getYear())
    }

    const editTask = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formDatas = Object.fromEntries(data.entries())
        try {
            await updateDoc(doc(db, "projects", currentProject,"tasks", keys),{
                taskName: formDatas.taskName ? formDatas.taskName : taskName,
                description: formDatas.taskDesc ? formDatas.taskDesc : taskDesc,
                deadline: formDatas.deadline ? Timestamp.fromDate(new Date(formDatas.deadline)) : Timestamp.fromDate(new Date(deadline)),
                isCompleted: formDatas.completed ? (formDatas.completed == "yes" ? true : false) : isCompleted,
                isPlanning: formDatas.planning ? (formDatas.planning == "yes" ? true : false) : isPlanning,
                proofReq: formDatas.proofReq ? (formDatas.proofReq == "yes" ? true : false) : proofReq,
                priority: formDatas.priority ? formDatas.priority : priority
            }).then(console.log("ediited"))
        } catch (error) {
            window.alert("Cant be Ediited")
            console.log(error)
        }
    }

    const deleteTask = async () => {
        try {
            const querySnap = await getDocs(query(collection(db, "projects", currentProject, "issues"), where("taskId", "==", keys)))
            querySnap.forEach(async (docs) => {
                await deleteDoc(doc(db, "projects", currentProject, "issues", docs.id))
            })
            await deleteDoc(doc(db, "projects", currentProject, "tasks", keys)).then(console.log("Successful"))
        } catch (error) {
            window.alert(error)
        }
    }
    return (
        <>
        <div className={`px-4 bg-zinc-100 rounded shadow-md transition-colors border-t-4 ${statusColor} ease-in`} >
            {/* <div className="flex items-center rounded bg-black/10 px-2 roboto-regular"><GoDotFill color={projectStatus ? "red" : "green"} /><h3>{projectStatus ? "Active" : "Planning"}</h3></div> */}
            <div className="flex pt-4">
                <div className="flex flex-col w-full justify-center">
                    <div className="flex justify-between">
                        <h1 className="roboto-bold text-xl">{taskName}</h1>
                        <div className="flex items-center gap-4 text-xl">
                            <FaEdit className="transition-colors ease-in hover:text-blue-500" onClick={() => seteditIcon(!editIcon)} />
                            <MdDelete className="transition-colors ease-in hover:text-red-500" onClick={deleteTask} />
                        </div>
                    </div>
                    <div className="flex gap-2 text-zinc-600">
                        <div className="flex items-center">
                            <MdDescription />
                        </div>
                        <h3 className="roboto-medium">{taskDesc}</h3>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-12 pb-2">
                <div className="flex items-center gap-2">
                    <MdOutlineUpdate color="red"/>
                    <h3 className="roboto-medium">{deadline ? date : "No Deadline"}</h3>
                </div>
            </div> 
            <div className="grid grid-cols-2 mt-4 border-t-2 border-zinc-300 py-2">
                <div className="flex justify-center items-center gap-2 p-2 rounded">
                    <h3 className="roboto-medium">{isCompleted ? "Completed" : "Not Completed"}</h3> 
                </div>
                <div className={`flex justify-center items-center gap-2 p-2 rounded ${proofReq ? "cursor-pointer" : ""} `} onClick={()=> proofReq && setproofSee(true)} >
                    <h3 className="roboto-medium">{proofReq ? "Proof Required":"Proof Not Required"} </h3>
                </div>
            </div>
        </div>
        {proofSee && (<div className="fixed w-full h-full left-0 top-0 flex justify-center items-center bg-black/30">
            <div className="w-1/2 h-5/6 bg-white rounded p-4">
                <div className="flex items-center justify-between roboto-bold text-3xl mb-8">
                    <h1>Proof</h1>
                    <RxCross2 className="cursor-pointer" onClick={()=> setproofSee(false)}/>
                </div>
                {proofDoc !="" ? (!proofType ? (<iframe src={proofDoc} className="w-full h-3/4" ></iframe>) : (<img src={proofDoc} className="w-full h-5/6" />)) : <h3 className="roboto-medium">Proof not Uploaded yet</h3>}
            </div>
        </div>)}
        {editIcon && (
            <div className="bg-white rounded">
                <h1 className="text-2xl roboto-bold mb-4">Edit this task</h1>
                <form onSubmit={editTask} className="grid grid-cols-2 gap-16">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label className="roboto-medium" htmlFor="taskName">Task Name</label>
                            <input className="" name="taskName" placeholder="Task Name" />
                        </div>
                        <div className="flex flex-col">
                            <label className="roboto-medium" htmlFor="taskDesc">Task Description</label>
                            <textarea rows={3} className="" type="text" name="taskDesc" placeholder="Task Description" />
                        </div>
                        <div className="flex flex-col">
                            <label className="roboto-medium" htmlFor="deadline">Deadline</label>
                            <div className="">
                                <input type="datetime-local" name="deadline"/>
                            </div>
                        </div>
                        <button className="w-fit" type="submit">Edit</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="roboto-medium">Priority</h3>
                            <div className="flex gap-4">
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
                        <div className="flex flex-col gap-2">
                            <h3 className="roboto-medium">Planning</h3>
                            <div className="flex items-center gap-4">
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
                        <div className="flex flex-col gap-2">
                            <h3 className="roboto-medium">Proof of Work</h3>
                            <div className="flex items-center gap-4">
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
                        <div className="flex flex-col gap-2">
                            <h3 className="roboto-medium">Completed</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="completed" value={true} />
                                    <label htmlFor="completed">Yes</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="completed" value={false} />
                                    <label htmlFor="completed">No</label>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        )}
        </>
    )
}