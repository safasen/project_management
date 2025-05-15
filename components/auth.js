"use client"
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const dosignOut = () => {
  return auth.signOut() 
}