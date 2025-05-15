import { FaCircleExclamation } from "react-icons/fa6";
import UserData from "./userData";
import { MdTaskAlt } from "react-icons/md";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function ProjectNotification({keys, type="review", sendBy, taskname, projectId, taskId}) {
    const accept = async () => {
        try {
            await updateDoc(doc(db, "projects", projectId, "tasks", taskId),{
                isCompleted: true
            }).then(async () => {
                try {
                    await deleteDoc(doc(db, "projects", projectId, "notifications", keys)).then(()=> window.alert("Task Reviewed Successfully"))
                } catch (error) {
                    window.alert("Notification Deletion Unsuccessful")
                }
            })
        } catch (error) {
            window.alert("Server Error!!! Please try again!!!")
        }
    }

    const reject = async () => {
        try {
            await deleteDoc(doc(db, "projects", projectId, "notifications", keys))
        } catch (error) {
            window.alert("Server Error!!! Please try again!!!")
        }
    }
    return (
        <>
        {type == "review" ? (
            <div className="flex flex-col gap-2 rounded p-2 bg-white">
                <h3 className="flex items-center gap-2 roboto-medium"><MdTaskAlt color="blue"/>Task Review</h3>
                <p className="roboto-light"><UserData connectionInfo={sendBy} /> has requested to review the task<p className="roboto-medium">{taskname}</p></p>
                <div className="flex items-center gap-2 roboto-medium text-white mt-4">
                    <div className="cursor-pointer py-2 px-4 bg-blue-500 rounded" onClick={accept}>Accept</div>
                    <div className="cursor-pointer py-2 px-4 bg-red-500 rounded" onClick={reject} >Reject</div>
                </div>
            </div>
        )
        : <div className="flex flex-col gap-2 rounded p-2 bg-white">
            <h3 className="flex items-center gap-2 roboto-medium"><FaCircleExclamation color="red" />Task Issue</h3>
            <p className="roboto-light"><UserData connectionInfo={sendBy} /> has raised an issue related to task<p className="roboto-medium">{taskname}</p></p>
            <div className="flex items-center gap-2 roboto-medium text-white mt-4">
                <div className="cursor-pointer py-2 px-4 bg-blue-500 rounded" onClick={reject}>Ok</div>
            </div>
        </div>}
        </>
    )
}