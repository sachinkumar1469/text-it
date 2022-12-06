import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({messages}) => {
  const {currentUser} = useContext(AuthContext);
  const ref = useRef();

  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  const {data} = useContext(ChatContext)
  return (
    <div ref={ref} className={`message ${currentUser.uid === messages.uid && 'owner'}`}>
      <div className="messageInfo ">
        <img src={currentUser.uid !== messages.uid?data.user.photoURL:currentUser.photoURL} alt="" />
        {/* <span>just now</span> */}
      </div>
      <div className="messageContent">
        <p>{messages.text}</p>
        {messages.photoURL && <img src={messages.photoURL} alt="msg image" />}
      </div>
    </div>
  )
}

export default Message
