import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import Message from './Message'
import { db } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
const Messages = () => {
  const {data} = useContext(ChatContext);
  const [messages,setMessages] = useState([]);

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,'chats',data?.chatId),(doc)=>{
      doc.exists() && setMessages(doc.data().messages);
      
    })
    return ()=>{
      unSub();
    }
  },[data.chatId])
  return (
    <div className='messages'>
      {messages.map((msg,index)=>{
        return <Message messages={msg} key={msg.uid+index}/>
      })}
      
    </div>
  )
}

export default Messages
