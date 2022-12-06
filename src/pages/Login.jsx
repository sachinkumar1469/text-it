import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Login = () => {
  const {currentUser,setCurrentUser} = useContext(AuthContext);
  const [err,setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e)=>{
    e.preventDefault();  
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    try{
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      // setCurrentUser(user);
      console.log(user);
      navigate('/')
    } catch(err){
      setErr(true);
    }
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Text-It</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span style={{color:"red",fontSize:"0.8rem"}}>Something went wrong...</span> }
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
