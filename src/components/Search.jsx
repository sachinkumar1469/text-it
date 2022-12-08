import React, { useContext, useState } from "react";
import { collection, query, where, getDocs,getDoc,doc,setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import {auth,db} from '../firebase'
import {BsSearch} from 'react-icons/bs'
import { AuthContext } from "../context/AuthContext";
const Search = () => {
  const [userName,setUserName] = useState("");
  const [searchUser,setSearchUser] = useState(null);
  const [err,setErr] = useState(false);

  const {currentUser} = useContext(AuthContext)

  const handleSearch = async ()=>{
    const userRef = collection(db, "users");
    try{

      const q = query(userRef, where("phoneNumber", "==", userName));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", JSON.stringify(doc.data()));
        setSearchUser((doc.data()));
      });
    } catch(err) {
      console.log('error')
    }
  }
  const handleKey = (e)=>{
    e.code === "Enter" && handleSearch();
  }
  const handleSelect = async (e)=>{
    const combinedId = currentUser.uid > searchUser.uid ? currentUser.uid + searchUser.uid : searchUser.uid + currentUser.uid;
    //First check whether the group(chats in firestore db) exists or not.
    try {
      const docRef = doc(db, "chats", combinedId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        const chatsRef = doc(db, 'chats', combinedId);
        await setDoc(chatsRef, {messages:[]}, { merge: true });

        const currUserRef = doc(db, "userChats", currentUser.uid);
        const searchUserRef = doc(db,"userChats",searchUser.uid);
        // Set the "capital" field of the city 'DC'
        await updateDoc(currUserRef, {
          [combinedId+".userInfo"]:{
            uid:searchUser.uid,
            displayName:searchUser.displayName,
            photoURL:searchUser.photoURL,
            
          },
          [combinedId+".lastMessage"]:"",
          [combinedId+".date"]:serverTimestamp(),

        });

        await updateDoc(searchUserRef, {
          [combinedId+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL,
            
          },
          [combinedId+".lastMessage"]:"",
          [combinedId+".date"]:serverTimestamp(),
        });
      }

      // const res = await getDocs(db,'chats')
      
    } catch (error) {
      setErr(true);
    }
    setSearchUser(null);
    setUserName("");
    //Create user chat
  }
  return (
    <div className="search">
      <div className="search-form-wrapper">
        <div className="searchForm">
          <BsSearch/>
          <input
            type="text"
            placeholder="Search Phone Number"
            onChange={e=>{setUserName(e.target.value)}}    
            onKeyDown={handleKey}
            value={userName}
          />
        </div> 

      </div>
      {   searchUser && 
          <div className="userChat" onClick={handleSelect}>
            <img src={searchUser?.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{searchUser?.displayName}</span>
              {/* <p>Hello</p> */}
            </div>
          </div>
      }
    </div>
  );
};

export default Search;
