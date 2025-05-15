import { cookies } from "next/headers";

export async function GET(request) {
    cookies().delete("auth-token")
    console.log("hello")
    return new Response("ok")
}