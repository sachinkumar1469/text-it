import { doc, setDoc,collection, addDoc } from "firebase/firestore"; 
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth,storage,db } from '../firebase'
import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import defaultImg from '../img/default_image.jpg'
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
    let file = e.target[4].files[0];
   

    try{ 
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res.user)
      let downloadURLDef = "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png";
      const storageRef = ref(storage, displayName);

      if(file){
        const uploadTask = uploadBytesResumable(storageRef, file );
  
        uploadTask.on(
          (error) => {
            setErr(true);
          }, 
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              console.log('File available at', downloadURL);
              downloadURLDef = downloadURL;
              await updateProfile(res.user,{
                displayName,
                phoneNumber,
                photoURL:downloadURLDef,
              });
              await setDoc(doc(db, "users",res.user.uid), {
                uid:res.user.uid,
                displayName,
                email,
                photoURL:downloadURLDef,
                phoneNumber,
              });
              await setDoc(doc(db,'userChats',res.user.uid),{});
              navigate('/')
            });
          }
        );
      } else {
        await updateProfile(res.user,{
          displayName,
          phoneNumber,
          photoURL:downloadURLDef,
        });
        await setDoc(doc(db, "users",res.user.uid), {
          uid:res.user.uid,
          displayName,
          email,
          photoURL:downloadURLDef,
          phoneNumber,
        });
        await setDoc(doc(db,'userChats',res.user.uid),{});
        navigate('/')
      }

    } catch(err){
      setErr(true);
      console.log('errorrrrrr')
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
