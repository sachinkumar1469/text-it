import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { useState } from "react";

const Chat = () => {
  const {data} = useContext(ChatContext);
  const currentSelectedUserId = data?.user?.uid || null;
  const [selectedUser,setSelectedUser] = useState();
  console.log("render");
  useEffect(()=>{
    fetchSelectedUser();
  },[data])
  async function fetchSelectedUser(){
    try {
      
      const docRef = doc(db, "users", currentSelectedUserId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedUser(docSnap.data());
        console.log(selectedUser);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>@{selectedUser?.phoneNumber} &nbsp; || &nbsp; {data?.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
