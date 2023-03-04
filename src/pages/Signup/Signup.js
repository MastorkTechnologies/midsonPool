
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth, createUserInDataBase } from '../../firebase/config'
import styles from "./Signup.module.css"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { create } from '../../redux/newUserSlice';

const SignUp = () => {
    const[data,setData]=useState({name:"",email:"",pass:"",confirmPass:""})
    const[loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const dispatch =useDispatch()

//HANDLE INPUT CHANGE
const handleInputChange=(e)=>{
    const{name,value}=e.target
    setData((prev)=>{
      return {...prev,[name]:value}
    })
  }

  //HANDLE LOGIN
const handleSignUp=async(e)=>{
  let newUser
    e.preventDefault();
    setLoading(true)
    if(data.pass.length<6){toast.error("Password should be min 6 letters");return}
    if (data.pass === data.confirmPass) {
       newUser={
        name:data.name,
        email: data.email,
        password:data.pass,
      }
try {
  await createUserInDataBase(data.email,newUser)
  await createUserWithEmailAndPassword(auth, data.email, data.pass)
  dispatch(create({ newUser }));
  setLoading(false)
  navigate("/dashboard");
  toast.success("Successfully Registered")
} catch (error) {
  setLoading(false)
  console.log(error);
  toast.error(error.message);
}
    
    }else{
      toast.error("Passwords do not match");
      setLoading(false)
    }
  }

  return (
    <section className={styles.signupCont}>
    <ToastContainer/>
<div className={styles.innerCont}>
  <form className={styles.form} onSubmit={handleSignUp}>
  <input onChange={handleInputChange} className={styles.input} type="name" name='name' placeholder='Name' value={data.name} required autoComplete='off' />
<input onChange={handleInputChange} className={styles.input} type="email" name='email' placeholder='Email' value={data.email} required autoComplete='off' />
<input onChange={handleInputChange} className={styles.input} type="password" name="pass" placeholder='Password' value={data.pass} required autoComplete='off' />
<input onChange={handleInputChange} className={styles.input} type="password" name="confirmPass" placeholder='Confirm Password' value={data.confirmPass} required autoComplete='off' />
<button disabled={loading} type='submit' className={styles.btn}>Signup</button>
  </form>
</div>
<h1 className={styles.text}>Already have an account?<NavLink to="/" className={styles.link}>Login</NavLink></h1>
   </section>
  )
}

export default SignUp