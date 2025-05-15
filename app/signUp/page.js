"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/components/auth";
import { setDoc ,doc , collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import Cookies from "universal-cookie";

export default function Auth() {
    const [username, setusername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")    //creating a reference of users collection
    const router = useRouter()
    const cookie = new Cookies()
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await signUp(email, password)
            cookie.set("auth-token",result.user.refreshToken)
            await setDoc(doc(db, "users" , result.user.uid), {
              userId : result.user.uid,
              name : username,
              email,
              createdAt : serverTimestamp()
            }).then(console.log("Successfully Submitted"))
            // .then((doc) => doc.id ? console.log("successfully submitted") : console.log("Unsuccessful"))
            .catch((err) => console.log(err))
            router.push("/user")
            router.refresh()
        } catch (error) {
            window.alert(error.code)
        }
    }
    return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-zinc-200 to-white p-24">
        <div className="flex flex-col items-center bg-zinc-200 rounded-lg p-12 gap-12">
          <h1 className="text-5xl roboto-bold">Sign In</h1>
          <form onSubmit={onSubmit} className="flex flex-col items-center justify-between space-y-4">
              <input placeholder="Name...." onChange={(e) => setusername(e.target.value)} required/>       
              <input placeholder="Email...." onChange={(e) => setEmail(e.target.value)} required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"/>
              <input placeholder="Password...." onChange={(e) => setpassword(e.target.value)} type="password" required minLength={4}/>
              <button type="submit">Submit</button>
          </form>
        </div> 
      </main>
    );
  }