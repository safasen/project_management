import { useState } from "react"
import TaskCard from "./taskCard"
import { Timestamp } from "firebase/firestore"

export default function Overview({taskList, isadmin}){
    const [isPlanning, setPlanning] = useState([]) 
    const [isCompleted, setCompleted] = useState([])
    if (taskList){
        taskList.map((item)=> {
            if (item.isCompleted){
                isCompleted.push(item)
                taskList.pop(item)
            }
            else if (item.isPlanning){
                isPlanning.push(item)
                taskList.pop(item)
            }
        })
    }

    return (
        <div className={`grid ${isadmin ? "grid-cols-4" : "grid-cols-3"}  gap-4`}>
            {isadmin && (<div>
                <h3 className="roboto-medium text-center p-2 mb-4 bg-red-200 rounded">OverDue</h3>
                <div className=" flex flex-col gap-4">
                    {taskList?.filter((t)=> !t.data().isPlanning && !t.data().isCompleted && t.data().deadline._compareTo(Timestamp.now()) == -1).length ==0 ? <h3 className="text-center roboto-medium">No Task</h3> : 
                    taskList?.filter((t)=> !t.data().isPlanning && !t.data().isCompleted && t.data().deadline._compareTo(Timestamp.now()) == -1).map((k)=> {
                        return <TaskCard forOverview = {true} key={k.id} keys={k.id} givenTo={k.data().givenTo} taskName={k.data().taskName} taskDesc={k.data().description} priority={k.data().priority} deadline={k.data().deadline.toDate()}/>
                    })}
                </div>
            </div>)}
            <div>
                <h3 className="roboto-medium text-center p-2 mb-4 bg-blue-200 rounded">Planning</h3>
                <div className=" flex flex-col gap-4">
                    {taskList?.filter((t)=> t.data().isPlanning == true).length ==0 ? <h3 className="text-center roboto-medium">No Task</h3> : 
                    taskList?.filter((t)=> t.data().isPlanning == true).map((k)=> {
                        return <TaskCard forOverview = {true} key={k.id} keys={k.id} givenTo={k.data().givenTo} taskName={k.data().taskName} taskDesc={k.data().description} priority={k.data().priority} deadline={k.data().deadline.toDate()}/>
                    })}
                </div>
            </div>
            <div>
                <h3 className="roboto-medium text-center p-2 mb-4 bg-yellow-200 rounded">In Progress</h3>
                <div className="flex flex-col gap-4">
                    {taskList?.filter((t)=> t.data().isPlanning == t.data().isCompleted).length ==0 ? <h3 className="text-center roboto-medium">No Task</h3> : 
                    taskList?.filter((t)=> t.data().isPlanning == t.data().isCompleted).map((k)=> {
                        return <TaskCard forOverview = {true} key={k.id} keys={k.id} taskName={k.data().taskName} givenTo={k.data().givenTo} taskDesc={k.data().description} priority={k.data().priority} deadline={k.data().deadline.toDate()}/>
                    })}
                </div>
            </div>
            <div>
                <h3 className="roboto-medium text-center p-2 mb-4 bg-green-200 rounded">Completed</h3>
                <div className=" flex flex-col gap-4">
                    {taskList.filter((t)=> t.data().isCompleted == true).length ==0 ? <h3 className="text-center roboto-medium">No Task</h3> : 
                    taskList.filter((t)=> t.data().isCompleted == true).map((k)=> {
                        return <TaskCard forOverview = {true} key={k.id} keys={k.id} taskName={k.data().taskName} givenTo={k.data().givenTo} taskDesc={k.data().description} priority={k.data().priority} deadline={k.data().deadline.toDate()}/>
                    })}
                </div>
            </div>
        </div>
    )
}