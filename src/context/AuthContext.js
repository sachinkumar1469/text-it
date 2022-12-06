import { createContext, useEffect, useState } from "react";
import {auth} from '../firebase'
import { onAuthStateChanged } from "firebase/auth";
export const AuthContext = createContext();
export const AuthContextProvider = ({children})=>{
    const [currentUser,setCurrentUser] = useState({});

    useEffect(()=>{
        const unSub = onAuthStateChanged(auth,(user)=>{
            setCurrentUser(user);
        })
        return ()=>{
            unSub();
        }
    },[]);
    return (
        <AuthContext.Provider value={{currentUser,setCurrentUser}}>
            {children}
        </AuthContext.Provider>
    )
}