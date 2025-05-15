"use client"
import { useEffect } from "react"
import {MdDescription, MdOutlineUpdate, MdOutlineDoneOutline} from "react-icons/md"
import {FaCircleExclamation} from "react-icons/fa6"
import { dateConv } from "./dateConv";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function IssueCard({keys,projectId, taskList, issueDesc, isadmin = false}) {
    // useEffect(() =>{
    //     console.log("IssueCard")
    // },[])
    const resolveIssue = async () => {
        try {
            await updateDoc(doc(db,"projects", projectId, "issues", keys), {
                issueResolved: true
            })
        } catch (error) {
            window.alert("Server problem!! Please try again")
        }
    }
    let date;
    const deadline = taskList[0]?.data().deadline.toDate()
    if (deadline){
        date = dateConv(deadline.getDate(), deadline.getMonth() + 1, deadline.getYear())
    }
    return (
        <div className={`px-4 bg-zinc-100 rounded shadow-md transition-colors border-t-4 `} >
            {/* <div className="flex items-center rounded bg-black/10 px-2 roboto-regular"><GoDotFill color={projectStatus ? "red" : "green"} /><h3>{projectStatus ? "Active" : "Planning"}</h3></div> */}
            <div className="flex justify-between pt-4">
                <div className="flex flex-col justify-center">
                    <h1 className="roboto-bold text-xl">{taskList[0]?.data().taskName}</h1>
                    <div className="flex gap-2 text-zinc-600">
                        <div className="flex items-center">
                            <MdDescription />
                        </div>
                        <h3 className="roboto-medium">{taskList[0]?.data().description}</h3>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-2 pb-2">
                <div className="flex items-center gap-2">
                    <MdOutlineUpdate color="red"/>
                    <h3 className="roboto-medium">{deadline ? date: "No deadline"}</h3>
                </div>
                <div className="flex gap-8">
                    {/* {!forOverview && (<FaCircleExclamation className="hover:bg-zinc-200 cursor-pointer" onClick={() => setissue(!issue) } />)} */}
                </div>
            </div>
            <div className="mt-6">
                <div className="flex items-center gap-2">
                    <FaCircleExclamation color="red" />
                    <h3 className="text-xl roboto-medium">Issue</h3>
                </div>
                <p className="roboto-medium text-base text-zinc-600">{issueDesc}</p>
            </div>
            {isadmin && (<div className="py-2">
                <div className="flex items-center gap-2 w-fit cursor-pointer p-2 hover:bg-zinc-200 rounded" onClick={resolveIssue} >
                    <MdOutlineDoneOutline/>
                    <h3 className="roboto-medium">Issue Resolved</h3> 
                </div>
            </div>)}
            
            
        </div>
    )
}