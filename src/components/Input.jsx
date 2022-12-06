import React from 'react'
import Img from '../img/img.png'
import Attach from '../img/attach.png'
import { useState } from 'react';
import { db,storage } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp, serverTimestamp } from "firebase/firestore";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuid } from 'uuid'

const Input = () => {
  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext)
  const [text,setText] = useState("");
  const [img,setImg] = useState(null);
  const [err,setErr] = useState(false)
  const handleSend = async ()=>{
    if(img){
      const storageRef = ref(storage, currentUser.uid);
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        (error) => {
          setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            const msgRef = doc(db, "chats", data.chatId);
            await updateDoc(msgRef, {
              messages: arrayUnion({
                msgId:uuid(),
                uid:currentUser.uid,
                text,
                date:Timestamp.now(),
                photoURL:downloadURL
              })
            });
          });
        }
      );
    } else {
      const msgRef = doc(db, "chats", data.chatId);
      await updateDoc(msgRef, {
        messages: arrayUnion({
          msgId: uuid(),
          uid:currentUser.uid,
          text,
          date:Timestamp.now(),
          photoURL:null
        })
      });
    }

    await updateDoc(doc(db,'userChats',currentUser.uid),{
      [data.chatId+'.lastMessage']:text,
      [data.chatId+".date"]:serverTimestamp(),
    })
    await updateDoc(doc(db,'userChats',data.user.uid),{
      [data.chatId+'.lastMessage']:text,
      [data.chatId+".date"]:serverTimestamp(),
    })
    setText("")
    setImg(null)
  }
  return (
    <div className='input'>
      <input type="text" name="" placeholder='type something....' id="" onChange={e=>{setText(e.target.value)}} value={text}/>
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" name="" style={{display:"none"}} id="file" onChange={e=>{setImg(e.target.files[0])}}  />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default Input
