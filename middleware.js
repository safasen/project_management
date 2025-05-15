import { NextResponse } from "next/server";

export function middleware(request) {
    let cookie = request.cookies.get('auth-token')
    const url = request.url
    if (url.includes("/user")) {
        if (!cookie) {
            const urls = request.nextUrl.clone()
            urls.pathname = '/signIn'
            return NextResponse.redirect(urls)
            // return NextResponse.redirect("http://localhost:3000/signIn")
        }
    }

    if (url.includes("/signIn") || url.includes("/signUp")) {
        if (cookie) {
            const urls = request.nextUrl.clone()
            urls.pathname = '/user'
            return NextResponse.redirect(urls)
            // return NextResponse.redirect("http://localhost:3000/signIn")
        }
    }
    return NextResponse.next()
}
