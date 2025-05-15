"use client"
import { useEffect, useState } from "react"
import IssueCard from "./issueCard"
import { db } from "@/config/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"

export default function IssueComp({currentProject, currentUser, taskList ,isadmin}) {
    const [issueList, setIssueList] = useState(null)
    const getIssueData = async () => {
        try {
          const querySnap = await getDocs(query(collection(db, "projects", currentProject, "issues"),where("issueResolved","==", false)))
          return querySnap
        } catch (error) {
          window.alert(error)
        }  
    }
    useEffect(()=>{
        async function fetchData() {
            const data =await getIssueData().then((d) => setIssueList(d.docs))  
        }
        fetchData();
    },[])

    
    return (
        <div className="grid grid-cols-2 gap-4">
            {!isadmin ? issueList?.filter((k) => k.data().taskGivenTo == currentUser).map((t) => {
                return <IssueCard key={t.id} keys={t.id} issueDesc={t.data().issueName} taskList={taskList.filter((item) => item.id == t.data().taskId)} isadmin={isadmin} />
            }) 
            :issueList?.map((k)=> {
                return <IssueCard key={k.id} keys={k.id} projectId={currentProject} issueDesc={k.data().issueName} taskList={taskList.filter((t) => t.id == k.data().taskId)} isadmin={isadmin} />
            })}
        </div>
    )
}