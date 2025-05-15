"use client"
import React, {useContext, useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [currentUser, setUser] = useState(null);

    useEffect(()=> {
        const unsub = onAuthStateChanged(auth, initializeUser)
        return unsub                             //cleaning up
    },[])

    async function initializeUser(user) {
        if (user) {
            setUser({ ...user })
        }
    }

    
    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )

}