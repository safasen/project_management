import { db } from "@/config/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

export default function UserData({withEmail=false ,connectionInfo}){
    const [connections, setconnections] = useState(null)
    useEffect(()=>{
        async function fetchdata() {
            await getDoc(doc(db,"users",connectionInfo)).then((user)=> {
                setconnections(user.data())
            })
        }
        fetchdata()
    },[])
    return ( 
        <div >
            {withEmail ?  (connections ? connections?.name[0].toUpperCase() + connections?.name.substring(1) + "(" + connections?.email + ")" : "Loading") : (connections ? connections?.name[0].toUpperCase() + connections?.name.substring(1) : "Loading")}
        </div>
        
    )
}