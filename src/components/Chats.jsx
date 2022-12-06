import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import {AuthContext} from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { async } from '@firebase/util';
const Chats = () => {
  const [chats,setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const {data,dispatch} = useContext(ChatContext);
  // console.log(data,"hiiiiiiiiiiiiii")
  useEffect(()=>{
    const getChats = ()=>{
      //Adding event listener on firebase collection everytime collection changes it will update the chats
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        //doc.data() will return an object
        setChats(doc.data());
      });
      //Cleanup function for event listener on firestore collections
      return ()=>{
        unsub();
      }

    }
    (currentUser.uid && getChats())
  },[currentUser.uid]);
  // console.log(Object.entries(chats));

  // Click handler on userChats to dispatch the action to ChatContext and change the state of selected chat
  const chatHandler = (chat)=>{
    dispatch({
      type:"CHANGE_USER",
      payload:chat?.[1].userInfo
    })
  }
  return (
    <div className='chats'>
      {Object.entries(chats).sort((a,b)=>b[1].date - a[1].date).map(chat=>{
        
        return (
          <div className="userChat" key={chat[0]} onClick={()=>{chatHandler(chat)}}>
            <img src={chat?.[1]?.userInfo?.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat?.[1]?.userInfo?.displayName}</span>
              <p>{chat?.[1]?.lastMessage}</p>
            </div>
          </div>          
        )
      })}
    </div>
  )
}

export default Chats
