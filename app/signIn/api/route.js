import { cookies } from "next/headers"

export async function POST(req) {
    const res = await req.json()
    return new Response("ok")
}

export async function GET(request) {
    const urls = request.url
    console.log("hello")
    return new Response("ok")
}