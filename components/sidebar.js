"use client" // remember this when using use auth
import {useAuth} from "@/context/authprovider.js"
import { FaHome, FaInbox, FaSignOutAlt, FaUserCircle, FaUserFriends } from "react-icons/fa"
import { FaCircleExclamation } from "react-icons/fa6"
import { GrProjects } from "react-icons/gr"
import { MdCreate, MdSummarize } from "react-icons/md"
import { usePathname, useRouter } from "next/navigation"
import { dosignOut } from "./auth"
import Cookies from "universal-cookie"

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const currentUsered = useAuth()
    const projects = null
    const cookie = new Cookies()
    const signout = () => {
        try {
          dosignOut()
          cookie.remove("auth-token")
          router.push("/")
        }
        catch (error) {
          console.log(error)
        }
  
    }
    return (
        <>
        {<div className="fixed w-1/3 lg:w-1/4 xl:w-1/5 flex flex-col p-2 gap-8">
                {/* {projects ? projects.users.map((user)=> {
                    return <p>{user}</p>
                }) : "Loading"} */}
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
                    <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaInbox/>Inbox</a></li>
                    <li><a className="flex items-center gap-2 my-2 px-2 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaUserFriends/>Connections</a></li>
                    </ul>
                </div>
                {pathname.includes("/user") && pathname.length > 5 && (<div className=" roboto-medium text-base text-light">
                    <div className="flex items-center gap-2 px-2 text-black">
                        <GrProjects />
                        <h2 className="text-lg">{projects ? projects.name : "Loading"}</h2>
                    </div>
                    <ul>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><MdSummarize/>Overview</a></li>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaUserFriends/>Team Members</a></li>
                    <li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><FaCircleExclamation/>Issues</a></li>
                    { (currentUsered?.email == projects?.admin ) && (<li><a className="flex items-center gap-2 my-2 px-2 pl-4 cursor-pointer rounded transition-colors ease-in hover:bg-gray-300 hover:text-black"><MdCreate/>Create Task</a></li>)}
                    </ul>
                </div>)}
            </div>}
            </>
    )
}