"use client"
import Image from "next/image";
import ProjectCard from "@/components/projectCard";
import { FaUserCircle, FaSignOutAlt, FaHome, FaUserFriends, FaInbox } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosAdd } from "react-icons/io";
import { dosignOut } from "@/components/auth";
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
// import { useRouter as useR } from "next/router";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "@/context/authprovider";
import Inbox from "@/components/inbox";
import Connection from "@/components/connection";
import Cookies from "universal-cookie";
import CreateProject from "@/components/createProject";

export default function User() {
    const router = useRouter()
    const user = useAuth() 
    const [projects, setProjects] = useState([])
    const [adminProject, setAdminProject] = useState([])
    const [inbox, setInbox] = useState(false)
    const [connect, setConnect] = useState(false)
    const [create, setcreate] = useState(false)
    const cookie = new Cookies()
    // const delCookie = async () => {
    //   await fetch('user/api',{
    //     method: 'GET'
    //   })
    // }

    const inboxstate = () => {
      setConnect(false)
      setInbox(!inbox)
    }

    const connectstate = () => {
      setInbox(false)
      setConnect(!connect)
    }
    const getData = async () => {
      try {
        const projectQuery = query(collection(db, "projects"), where("users","array-contains",user.uid))
        const querySnap = await getDocs(projectQuery)
        return querySnap
      } catch (error) {
        window.alert(error.code)
      }  
    }
    const getRealData =() => {
      try {
        const projectQuery = query(collection(db, "projects"), where("admin","==",user.uid))
        const querySnap = onSnapshot(projectQuery, (doc) => {
          setAdminProject(doc.docs)
        })
        return querySnap
      } catch (error) {
        window.alert(error.code)
      }  
    }
    useEffect(() => {
      if (user) {
        async function fetchData() {
          const data = await getData().then((d) => setProjects(d.docs))  
        }
        fetchData();
      }
    },[user?.uid])

    useEffect(()=> {
      if (user){
        const unsub = getRealData()
        return ()=>{unsub()}
      }
      
    },[user?.uid])

    const signout = () => {
      try {
        dosignOut().then(()=>cookie.remove("auth-token"))
        router.push("/")
      }
      catch (error) {
        console.log(error)
      }

    }
    return (
      <main className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-h-screen">
        <div className="fixed flex w-1/3 lg:w-1/4 xl:w-1/5 flex-col p-2 gap-10">
          <div className="flex justify-between items-center roboto-medium text-lg px-2">
            <div className="flex items-center gap-2">
              <FaUserCircle/>
              <h1>{user ? user.email : "Loading Details"}</h1>
            </div>
            <FaSignOutAlt className="cursor-pointer" onClick={signout}/>  
          </div>
          <div className="roboto-medium text-light">
            <ul>
              <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaHome/>Home</a></li>
              <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={inboxstate}><FaInbox/>Inbox</a></li>
              <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black" onClick={connectstate}><FaUserFriends/>Connections</a></li>
            </ul>
          </div>
        </div>
        <div></div>
        <div className="bg-white col-span-2 lg:col-span-3 xl:col-span-4 text-black/85 p-12">
          {/* <button onClick={signout} className="bg-black text-white w-min px-4 py-2">SignOut</button> */}
          <h1 className="text-5xl roboto-black">Projects</h1>
          <div className="grid grid-cols-3 my-8 gap-4">
            {projects.map((k)=> {
              return <ProjectCard key={k.id} keys={k.id} projectName={k.data().name} adminName={k.data().admin} projectDate={k.data().deadline.toDate()} projectStatus= {k.data().projectStatus}/>
            })}
          </div>
          <h1 className="flex items-end gap-2 text-5xl roboto-black mt-20">Your Projects <IoIosAdd className="cursor-pointer transition-colors ease-in hover:text-blue-500" onClick={()=> setcreate(true)} /></h1>
          <div className="grid grid-cols-3 my-8 gap-4">
            {adminProject.map((k)=> {
              return <ProjectCard key={k.id} keys={k.id} projectName={k.data().name} adminName={k.data().admin} projectDate={k.data().deadline.toDate()} projectStatus= {k.data().projectStatus}/>
            })}
          </div>
        </div>
        {inbox && (
              <Inbox userId={user.uid} />
          )}
        {connect && (
          <Connection userId={user.uid} />
        )}
        {create && <div className="fixed w-full h-full flex justify-center items-center bg-black/30">
          <div className="w-1/2 h-2/3 bg-white rounded p-4">
            <div className="flex items-center justify-between roboto-bold text-3xl mb-8">
              <h1>Create Project</h1>
              <RxCross2 className="cursor-pointer" onClick={()=> setcreate(false)}/>
            </div>
            <div className="ml-4">
              <CreateProject currentUser={user.uid}/>
            </div>
          </div>
        </div>}
      </main>
    );
}