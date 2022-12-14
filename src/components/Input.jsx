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
import {BsEmojiSmile} from 'react-icons/bs';
import {ImAttachment} from 'react-icons/im';
import {BiImages} from 'react-icons/bi';
let count = 0;
const Input = () => {
  const {data} = useContext(ChatContext);
  const {currentUser} = useContext(AuthContext)
  const [text,setText] = useState("");
  const [img,setImg] = useState(null);
  const [err,setErr] = useState(false)
  const handleSend = async ()=>{
    count++;
    console.log(count,"Inside handleSend");
    if(img){
      const storageRef = ref(storage, `chats/${currentUser.uid}`);
      console.log("Inside if condition")
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on('state_changed',
      (snapshot)=>{
        let progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {
        setErr(true);
      },
        () => {
          console.log("Inside on")
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            console.log("inside download url")
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
      console.log('inside else')
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
      <BsEmojiSmile/>
      <ImAttachment/>
      <input type="text" name="" placeholder='Type a message' id="" onChange={e=>{setText(e.target.value)}} value={text}/>
      <input type="file" name="" style={{display:"none"}} id="file" onChange={e=>{setImg(e.target.files[0])}}  />
      <label htmlFor="file">
        <BiImages/>
      </label>
      <div className="send">
        {/* <img src={Attach} alt="" /> */}
        <button onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default Input
