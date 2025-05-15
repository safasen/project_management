"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/components/auth";
import Cookies from "universal-cookie";

export default function Auth() {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const cookie = new Cookies()
    const router = useRouter()
    const setCookie = async (token) => {
      await fetch('signIn/api', {
        method: 'GET'
      })
    }
    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await signIn(username, password)
            cookie.set("auth-token",result.user.refreshToken)
            router.push("/user")
            
        } catch (error) {
            window.alert(error.code)
            console.log(error)
        }
    }
    return (
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-zinc-200 to-white p-24">
        <div className="flex flex-col items-center bg-zinc-200 rounded-lg p-12 gap-12">
          <h1 className="text-5xl roboto-bold">Sign In</h1>
          <form onSubmit={onSubmit} className="flex flex-col items-center justify-between space-y-4">
              <input placeholder="Email...." onChange={(e) => setusername(e.target.value)} required pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"/>
              <input placeholder="Password...." onChange={(e) => setpassword(e.target.value)} type="password" required minLength={4}/>
              <button type="submit">Submit</button>
          </form>
        </div>
        
      </main>
    );
  }