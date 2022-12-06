import { createContext, useEffect, useState } from "react";
import {auth} from '../firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useReducer } from "react";



export const ChatContext = createContext();


export const ChatContextProvider = ({children})=>{
    const {currentUser} = useContext(AuthContext)
    const INITAL_STATE = {
        chatId:"null",
        user:{}
    }
    const chatReducer = (state=INITAL_STATE,action)=>{
        switch(action.type){
            case "CHANGE_USER":{
                return {
                    user:action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
                }                
            }
            default :{
                return state;
            }
            
        }
    }

    const [state,dispatch] = useReducer(chatReducer,INITAL_STATE) 
    // console.log(state);
    return (
        <ChatContext.Provider value={{data:state,dispatch}}>
            {children}
        </ChatContext.Provider>
    )
}