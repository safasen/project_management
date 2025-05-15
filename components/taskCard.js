"use client"
import { FaCircleExclamation } from "react-icons/fa6"
import { MdOutlineUpdate, MdDescription, MdOutlineDoneOutline } from "react-icons/md"
import {IoMdDocument} from "react-icons/io"
import { dateConv } from "./dateConv"
import { useRef, useState } from "react"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { db } from "@/config/firebase"
import upload from "@/config/uploadFile"
import { RxCross2 } from "react-icons/rx"
import { FaUserCircle } from "react-icons/fa"
import UserData from "./userData"
// import { useUserStore } from "@/config/userStore"
// import { useRouter } from "next/navigation"

export default function TaskCard({keys, currentProject,currentUser , taskName, taskDesc, givenTo, isCompleted=false, isPlanning=false ,priority="2", deadline, forOverview=false, proofReq = true, admin }) {
    // const {currentUsered} = useUserStore()
    const [issue, setissue] = useState(false)
    const [proofToggle, setprooftogggle] = useState(false)
    const [imgurl, setimgurl] = useState({
        file: null,
        url: ""
    })
    const issueForm = useRef(null)
    const prioritycolor = (prior) => {
        if (prior == "1"){
            return "border-red-500"
        }else if (prior == "2"){
            return "border-yellow-500"
        }else {
            return "border-green-500"
        }
    }
    let date;
    if (deadline){
        date = dateConv(deadline.getDate(), deadline.getMonth() + 1, deadline.getYear())
    }
    const statusColor = prioritycolor(priority)
    const issueSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDoc(collection(db,"projects", currentProject, "issues"), {
                taskId : keys,
                issueName : issueForm.current.value,
                issueResolved : false,
                taskGivenTo : givenTo
            })
        } catch (error) {
            window.alert("Issue cant be submiited")
            console.log(error)
        }
        
    }
    const uploadProof = async (e) => {
        e.preventDefault()
        if (imgurl.file){
            const img = await upload(imgurl.file)
            try {
                await updateDoc(doc(db,"projects", currentProject, "tasks", keys),{
                    proof: img ? img : "",
                    proofType : imgurl.file.type.includes("image") ? true : false
                })
            } catch (error) {
                console.log("An error occured while uploading!!!")
            }
        } else {
            window.alert("Can't select file!! Please try again")
        }
    }

    const completeTask = async () => {
        if (isCompleted){
            return
        }
        try {
            await addDoc(collection(db, "projects", currentProject, "notifications"),{
                sendBy: currentUser,
                sendAt: serverTimestamp(),
                type: "review",
                taskName: taskName,
                taskId: keys
            })
        } catch (error) {
            window.alert("Server Error!!! Please try again!!!")
        }
    }

    return (
        <div className={`px-4 bg-zinc-100 rounded shadow-md transition-colors border-t-4 ${statusColor} ease-in ${isCompleted ? "opacity-30": ""}`} >
            {/* <div className="flex items-center rounded bg-black/10 px-2 roboto-regular"><GoDotFill color={projectStatus ? "red" : "green"} /><h3>{projectStatus ? "Active" : "Planning"}</h3></div> */}
            <div className="flex justify-between pt-4">
                <div className="flex flex-col justify-center">
                    <h1 className="roboto-bold text-xl">{taskName}</h1>
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
                <div className="flex gap-8">
                    {!forOverview && (<FaCircleExclamation className="hover:bg-zinc-200 cursor-pointer" onClick={() => !isCompleted && setissue(!issue) } />)}   
                    {forOverview && (<div className="flex items-center gap-1">
                            <FaUserCircle color="blue" />
                            <h3 className="roboto-medium"><UserData connectionInfo={givenTo} /></h3>
                    </div>)} 
                </div>
            </div>
            {!forOverview && issue && (<div>
                <form onSubmit={issueSubmit} className="flex gap-2">
                    <input  type="text" name="issue" ref={issueForm} className="w-full" placeholder="Submit your issue here"/>
                    <button type="submit" className="w-1/4">Submit</button>
                </form>
            </div>)}
            { !forOverview && 
            (<div className="grid grid-cols-2 mt-4 border-t-2 border-zinc-300 py-2">
                <div className={`flex justify-center items-center gap-2 cursor-pointer p-2 hover:bg-zinc-200 rounded`} onClick={completeTask} >
                    <MdOutlineDoneOutline/>
                    <h3 className="roboto-medium">Completed</h3> 
                </div>
                <div className={`flex justify-center items-center gap-2 ${!proofReq ? "cursor-not-allowed": "cursor-pointer"} p-2 hover:bg-zinc-200 rounded`} onClick={()=> !isCompleted && proofReq && setprooftogggle(true)} >
                    <IoMdDocument />
                    <h3 className="roboto-medium">
                        Attach file
                    </h3>
                </div>
            </div>)}
            {proofToggle && (<div className="fixed z-10 w-full h-full left-0 top-0 flex justify-center items-center bg-black/30">
                <div className="w-1/2 h-2/3 bg-white rounded p-4">
                    <div className="flex items-center justify-between roboto-bold text-3xl mb-8">
                        <h1>Upload Proof</h1>
                        <RxCross2 className="cursor-pointer" onClick={()=> setprooftogggle(false)}/>
                        </div>
                    <form className="ml-4" onSubmit={uploadProof}>
                        <div>
                            <label htmlFor="proof"></label>
                            <input type="file" name="proof" id="proof" onChange={(e)=> setimgurl({file: e.target.files[0], url: URL.createObjectURL(e.target.files[0])})} required />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button className="w-fit" type="submit">Submit</button>
                            <button className="w-fit bg-black text-white" type="reset" onClick={()=> setimgurl({file: null, url:""})} >Reset</button>
                        </div>
                        {imgurl.url != "" ? (imgurl.file.type.includes("image") ? <img src={imgurl.url} className="mt-4 w-1/2" /> : <iframe src={imgurl.url} className="mt-4 w-1/2"></iframe>) : ""} 
                    </form>
                </div>
            </div>)}
        </div>
    )
}