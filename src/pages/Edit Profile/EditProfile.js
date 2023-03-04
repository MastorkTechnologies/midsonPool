import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar'
import { updateUserInDataBase } from '../../firebase/config';
import styles from "./EditProfile.module.css"

const EditProfile = () => {
    const userData = useSelector(state=>state.user.userData);
    const[isLoading,setIsloading]=useState(false)
    const[userDetail,setUserDetail]=useState({name:userData?.name,email:userData?.email,number:userData?.phoneNumber})

    useEffect(()=>{
if(userData){
    setUserDetail((prev)=>{
       return{...prev,name:userData?.name,email:userData?.email,number:userData?.phoneNumber} 
    })
}
    },[userData])

const handleChange=(e)=>{
    const{name,value}=e.target
    setUserDetail((prev)=>{
        return {...prev,[name]:value}
    })
}

const handleUpdateUser=async(e)=>{
    e.preventDefault()
    await updateUserInDataBase(userDetail.email,userDetail,setIsloading)
    console.log(userDetail)
    
}

  return (
   <>
    <Navbar/>
    <section className={styles.outerCont}>
        <form onSubmit={handleUpdateUser} className={styles.form}>
        <label className={styles.label} htmlFor="name">User Name</label>
            <input onChange={handleChange} className={styles.input} name="name" id='name' type="name" placeholder='Name' required value={userDetail.name}/>
            <label className={styles.label} htmlFor="email">User Email</label>
            <input className={styles.input} name="email" id='email' type="email" placeholder='email' disabled value={userDetail.email}/>
            <label className={styles.label} htmlFor="number">User Phone Number</label>
            <input onChange={handleChange} className={styles.input} name="number" id='number' type="number" placeholder='Phone Number' value={userDetail.number}/>
            <button disabled={isLoading} className={styles.btn} type='submit'>Update</button>
        </form>
    </section>
   </>
  )
}

export default EditProfile