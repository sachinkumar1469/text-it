import React, { useContext } from 'react'

import { AuthContext } from "../context/AuthContext";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <span className="logo">TextIt</span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span>{currentUser?.displayName}</span>
        <button onClick={async()=>{ await signOut(auth)}}>logout</button>
      </div>
    </div>
  )
}

export default Navbar