import { db } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function UserList({forAdd = true,connectionInfo}){
    const [connections, setconnections] = useState(null)
    const [color, setcolor] = useState("")
    useEffect(()=>{
        async function fetchdata() {
            await getDoc(doc(db,"users",connectionInfo)).then((user)=> {
                setconnections(user.data())
            })
        }
        fetchdata()
    },[])
    return ( 
        <div onClick={()=> forAdd ? setcolor("bg-blue-200"): setcolor("bg-red-200")} onDoubleClick={() => setcolor("")} className={`px-2 cursor-pointer hover:bg-zinc-200 ${color}`} >
            {connections?.name[0].toUpperCase() + connections?.name.substring(1) + " (" + connections?.email + ")"}
        </div>
        
    )
}