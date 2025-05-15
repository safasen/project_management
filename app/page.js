import Image from "next/image";

// import { authProvider } from "@/components/authprov";

export default function Home() {
  // const username = authProvider()
  // console.log(username)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24 bg-gradient-to-r from-zinc-300 to-white">
      <div className="w-1/2 text-center flex flex-col gap-4">
        <h1 className="text-5xl  roboto-bold">Real-Time Project Management App</h1>
        <h3 className="text-xl roboto-medium">Welcome to the real-time project Management app where you can manage your projects efficiently and easily</h3>
      </div>
      <div className="flex gap-4">
        <a href="/signIn" className="bg-black text-white px-4 py-2 rounded">SignIn</a>
        <a href="/signUp" className="bg-black text-white px-4 py-2 rounded">Get Started</a>
      </div>
    </main>
  );
}
