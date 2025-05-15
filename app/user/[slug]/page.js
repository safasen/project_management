"use client"
import { getDoc,collection, query, doc, getDocs, where, onSnapshot, deleteDoc } from "firebase/firestore"
import { db } from "@/config/firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { dosignOut } from "@/components/auth"
import Cookies from "universal-cookie"
import { FaUserCircle, FaSignOutAlt, FaHome, FaUserFriends, FaInbox, FaEdit } from "react-icons/fa";
import {FaCircleExclamation} from "react-icons/fa6"
import {MdSummarize, MdCreate, MdDelete} from "react-icons/md"
import {GrProjects} from "react-icons/gr"
import TaskCard  from "@/components/taskCard"
import CreateTask from "@/components/createTask"
import { useAuth } from "@/context/authprovider"
import Overview from "@/components/overview"
import IssueComp from "@/components/issueComponent"
import TeamChat from "@/components/teamChat"
import TaskAdmin from "@/components/taskAdmin"
import { RxCross2 } from "react-icons/rx"
import EditProject from "@/components/editProject"
import ProjectInbox from "@/components/projectInbox"
import Connection from "@/components/connection"



export default function Page({params}){
    const currentUsered = useAuth()
    const [tasks, setTasks] = useState(null)
    const [projects, setprojects] =useState(null)
    const [createTask, setcreateTask] = useState(false)
    const [overview, setoverview] = useState(false)
    const [teamMembers, setTeam] = useState(false)
    const [issues, setIssues] = useState(false)
    const [edit, setEdit] = useState(false)
    const [inbox, setinbox] = useState(false)
    const [connect, setConnect]  = useState(false)
    const router = useRouter()
    const cookie = new Cookies()
    const createTaskClick = () => {
        setcreateTask(!createTask)
        setIssues(false)
        setTeam(false)
        setoverview(false)
    }
    const overviewClick = () => {
        setoverview(!overview)
        setIssues(false)
        setTeam(false)
        setcreateTask(false)
    }
    const teamMembersClick = () => {
        setTeam(!teamMembers)
        setIssues(false)
        setcreateTask(false)
        setoverview(false)
    }
    const issuesClick = () => {
        setIssues(!issues)
        setTeam(false)
        setcreateTask(false)
        setoverview(false)
    }

    const delCookie = async () => {
        await fetch('api', {
            method: 'GET'
        })
    }

    const inboxstate = () => {
        setConnect(false)
        setinbox(!inbox)
      }
  
      const connectstate = () => {
        setinbox(false)
        setConnect(!connect)
      }

    const getProjectData = async () => {
        try {
            const querySnap = await getDoc(doc(db, "projects", params.slug))
            return querySnap
        } catch (error) {
            window.alert(error.code)
        }
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db,"projects", params.slug), (doc)=> {
            setprojects(doc.data())
        })
        return () => {unsub()}
    },[])

    useEffect(()=> {
        const unsub = onSnapshot(collection(db, "projects", params.slug, "tasks"), (doc)=> {
            setTasks(doc.docs)
        })
        
        return ()=> {unsub()}       
    },[])

    const deleteProject = async () => {
        try {
            await deleteDoc(doc(db,"projects", params.slug))
            await deleteDoc(doc(db,"chats", params.slug))
            router.push("/user")
        } catch (error) {
            window.alert("High Server Load!!!")
        }
    }

    const signout = () => {
        try {
            dosignOut()
            delCookie()
            router.push("/")
        }
        catch (error) {
          console.log(error)
        }
  
    }

    return (
        <>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-h-screen">
            <div className="fixed w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col p-2 gap-8">
                <div className="flex justify-between items-center roboto-bold text-base px-2">
                    <div className="flex items-center gap-2">
                        <FaUserCircle/>
                        <h1>{currentUsered ? currentUsered.email : "Loading"}</h1>
                    </div>
                    <FaSignOutAlt className="cursor-pointer" onClick={signout}/>  
                </div>
                <div className="roboto-medium text-base text-light">
                    <ul>
                    <li><a href="/user" className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaHome/>Home</a></li>
                    {(currentUsered?.uid == projects?.admin ) && (<li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={inboxstate} ><FaInbox/>Inbox</a></li>)}
                    <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={connectstate} ><FaUserFriends/>Connections</a></li>
                    </ul>
                </div>
                <div className=" roboto-medium text-base text-light">
                    <div className="flex items-center gap-2 px-2 text-black">
                        <GrProjects />
                        <h2 className="text-lg">{projects ? projects.name : "Loading"}</h2>
                    </div>
                    <ul>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={overviewClick}><MdSummarize/>Overview</a></li>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={teamMembersClick}><FaUserFriends/>Team Members</a></li>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={issuesClick}><FaCircleExclamation/>Issues</a></li>
                    { (currentUsered?.uid == projects?.admin ) && (<li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={createTaskClick}><MdCreate/>Create Task</a></li>)}
                    { (currentUsered?.uid == projects?.admin ) && (<li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={()=> setEdit(true)}><FaEdit/>Edit Project</a></li>)}
                    { (currentUsered?.uid == projects?.admin ) && (<li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={deleteProject}><MdDelete />Delete Project</a></li>)}
                    </ul>
                </div>
            </div>
            <div></div>
            <div className="bg-white col-span-2 lg:col-span-3 xl:col-span-4 text-black/85 p-12">
                <div>
                    {/* <h1 className="text-5xl roboto-black mb-8">{!createTask ? "Tasks" : "Create Tasks"}</h1> */}
                    {!createTask && !overview && !teamMembers && !issues && (
                        <>
                        <h1 className="text-5xl roboto-black mb-8">Tasks</h1>
                        <div className="flex flex-col gap-8">
                        {(currentUsered?.uid == projects?.admin) ? (tasks?.map((k)=> {
                            return <TaskAdmin key={k.id} currentProject={params.slug} keys={k.id} taskName={k.data().taskName} taskDesc={k.data().description} priority={k.data().priority} proofReq={k.data().proofReq} isCompleted={k.data().isCompleted} isPlanning={k.data().isPlanning} deadline={k.data().deadline.toDate()} proofDoc={k.data().proof} proofType={k.data().proofType} />
                        }))
                        : (tasks?.filter((t)=>t.data().givenTo == currentUsered?.uid).map((k)=> {
                            return <TaskCard key={k.id} givenTo={k.data().givenTo} currentProject={params.slug} keys={k.id} taskName={k.data().taskName} taskDesc={k.data().description} priority={k.data().priority} proofReq={k.data().proofReq} deadline={k.data().deadline.toDate()} admin={projects?.admin} currentUser={currentUsered?.uid} isCompleted={k.data().isCompleted} isPlanning={k.data().isPlanning}/>
                        }))}
                        </div>
                        </>
                )} 
                    {createTask && (
                        <>
                        <h1 className="text-5xl roboto-black mb-8">Create Task</h1>
                        <CreateTask users = {projects?.users} currentUser = {currentUsered.uid} currentProject = {params.slug} />
                        </>
                    )}
                    {overview && (
                        <>
                        <h1 className="text-5xl roboto-black mb-8">Overview</h1>
                        <Overview taskList={tasks} isadmin = {currentUsered?.uid == projects?.admin} />
                        </>
                    )}
                    {teamMembers && (
                        <>
                        <h1 className="fixed bg-white text-5xl w-2/3 lg:w-3/4 xl:w-4/5 roboto-black top-0 pt-12">Team Chat</h1>
                        <TeamChat currentUser={currentUsered.uid} projectId={params.slug} admin={projects?.admin} />
                        </>
                    )}
                    {issues && (
                        <>
                        <h1 className="text-5xl roboto-black mb-8">Issues</h1>
                        <IssueComp taskList={tasks} currentProject={params.slug} isadmin = {currentUsered?.uid == projects?.admin} currentUser={currentUsered.uid} />
                        </>
                    )}
                    
                </div>
            </div>
            {inbox && (
                <ProjectInbox currentProject={params.slug} />
            )}
            {connect && (
                <Connection userId={currentUsered?.uid} />
            )}
            {edit && <div className="fixed  w-full h-full flex justify-center items-center bg-black/30">
                <div className="w-1/2 h-2/3 bg-white rounded p-4 ">
                    <div className="flex items-center justify-between roboto-bold text-3xl mb-8">
                    <h1>Edit Project</h1>
                    <RxCross2 className="cursor-pointer" onClick={()=> setEdit(false)}/>
                    </div>
                    <div className="ml-4">
                    <EditProject currentUser={currentUsered.uid} projectDetails={projects} projectId={params.slug} />
                    </div>
                </div>
            </div>}
        </div>
        </>
    )
}