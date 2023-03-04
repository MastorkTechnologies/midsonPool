import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth, getUserFromDatabase } from '../../firebase/config'
import { logout, setUserData } from '../../redux/userSlice'
import styles from "./Navbar.module.css"
import {remove} from "../../redux/newUserSlice"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'


const Navbar = () => {
    const dispatch=useDispatch()
    const user = useSelector(state=>state.user);
    const navigate=useNavigate()
    console.log("user",user)

  //HANDLE SIGNOUT  
const handleLogout=()=>{
    signOut(auth)
    .then(() => {dispatch(logout());dispatch(remove());dispatch(setUserData(null))})
     .then(() => {toast.success("Sucessfully logged out");navigate("/");})
 
}

//FETCH USERDATA FROM FIREBASE
const fetchdata=async(email)=>{
    const userDetaill=await getUserFromDatabase(email)
    dispatch(setUserData(userDetaill))
}

//CHECK FOR USER
useEffect(()=>{
if(user.user&&!user.userData){fetchdata(user.user.email)}
},[user])

useEffect(()=>{
if(user.user){fetchdata(user.user.email)}
},[])


  return (
    <section className={styles.navbar}>
    <ToastContainer/>
       <h1 style={{cursor:"pointer"}} onClick={()=>navigate("/")}>Home</h1> 
       <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </section>
  )
}

export default Navbar