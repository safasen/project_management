"use client"
import { FaUser } from "react-icons/fa"
import { MdOutlineUpdate } from "react-icons/md"
import {GoDotFill} from "react-icons/go"
import { dateConv } from "./dateConv"
import UserData from "./userData"
// import { useUserStore } from "@/config/userStore"
// import { useRouter } from "next/navigation"

export default function ProjectCard({keys, projectName, adminName, projectDate, projectStatus=true}) {
    // const {currentUsered,isLoading,fetchUser} = useUserStore()
    // const router = useRouter()
    // const navigate = () => {
    //     if (keys) {
    //         router.push(`/user/${keys}`)
    //     }
    // }
    // console.log(projectDate.getYear())
    let date;
    if (projectDate){
        date = dateConv(projectDate.getDate(), projectDate.getMonth() + 1, projectDate.getYear())
    }
    // console.log(currentUsered)
    return (
        <>
        <a href={`/user/${keys}`} className="p-4 bg-zinc-100 rounded shadow-md transition-colors ease-in hover:bg-zinc-200 cursor-pointer" >
            <div className="flex flex-col justify-center">
                <h1 className="roboto-bold text-xl">{projectName}</h1>
                <div className="flex items-center gap-2">
                    <FaUser color="blue" />
                    <h3 className="roboto-medium"><UserData connectionInfo={adminName} /></h3>
                </div>
            </div>
            <div className="flex justify-between mt-12">
                <div className="flex items-center gap-2">
                    <MdOutlineUpdate color="red"/>
                    <h3 className="roboto-medium">{projectDate ? date : "No Deadline"}</h3>
                </div>
                <div className="flex items-center rounded bg-black/10 px-2 roboto-regular"><GoDotFill color={projectStatus ? "red" : "green"} /><h3>{projectStatus ? "Active" : "Planning"}</h3></div>
            </div>
        </a>
        </>
    )
}