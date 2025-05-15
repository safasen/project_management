"use client"
import {useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

export const authProvider = () => {
    // const [currentUser, setcurrentUser] = useState("hello")
    // const [isloggedIn, setisloggedIn] = useState(false)
    // const [loading, setLoading] = useState(true)

    // useEffect(()=> {
    //     const sub = onAuthStateChanged(auth, initializeUser)
    //     return sub
    // },[])

    // async function initializeUser(user) {
    //     if (user){
    //         setcurrentUser({...user})
    //         setisloggedIn(true)
    //     } else {
    //         setcurrentUser(null)
    //         setisloggedIn(false)
    //     }
        
    //     // setLoading(false)
    // }

    const value = {
        currentUser : "hello",
        isloggedIn : 123
        // loading
    }

    return value;

}