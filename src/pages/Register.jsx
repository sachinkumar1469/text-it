import { doc, setDoc,collection, addDoc } from "firebase/firestore"; 
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth,storage,db } from '../firebase'
import React, { useState } from "react";
import Add from "../img/addAvatar.png";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [err,setErr] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const phoneNumber = e.target[2].value;
    const password = e.target[3].value;
    const file = e.target[4].files[0];

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user)
    
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr(true);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            await updateProfile(res.user,{
              displayName,
              phoneNumber,
              photoURL:downloadURL,
            });
            await setDoc(doc(db, "users",res.user.uid), {
              uid:res.user.uid,
              displayName,
              email,
              photoURL:downloadURL,
              phoneNumber,
            });
            await setDoc(doc(db,'userChats',res.user.uid),{});
            navigate('/')
          });
        }
      );

    } catch(err){
      setErr(true);
    }
  }



  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Text-It</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="number" name="phoneNumber" placeholder="phone" id="" />
          <input required type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
         {err && <span style={{color:"red",fontSize:"0.8rem"}}>Something went wrong...</span> }
        </form>
        <p>
        You do have an account? <Link to='/login'>Login</Link> 
        </p>
      </div>
    </div>
  );
};

export default Register;
