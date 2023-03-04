import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import styles from "./Login.module.css"
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { login, logout } from '../../redux/userSlice'

const Login = () => {
    const[data,setData]=useState({email:"",pass:""})
    const[loading,setLoading]=useState(false)
    const dispatch = useDispatch();
    const navigate=useNavigate()

//HANDLE INPUT CHANGE
const handleInputChange=(e)=>{
    const{name,value}=e.target
    setData((prev)=>{
      return {...prev,[name]:value}
    })
  }

  //HANDLE LOGIN
const handleLogin=async(e)=>{
    e.preventDefault();
    setLoading(true)
    signInWithEmailAndPassword(auth, data.email, data.pass)

      .then(() => {
        toast.success("Sucessfully logged in");
        setLoading(false)
        navigate("/dashboard");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false)
      });
    }

//CHECK IF USER IS ALREADY LOGGED IN
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(
            login({
              email: auth.currentUser.email,
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL,
            })
          )
          navigate("/dashboard")
        } else {
          dispatch(logout());
        }
      });
    }, []);

  return (
    <section className={styles.loginCont}>
    <ToastContainer/>
<div className={styles.innerCont}>
  <form className={styles.form} onSubmit={handleLogin}>
<input onChange={handleInputChange} className={styles.input} type="email" name='email' placeholder='Email' value={data.email} required autoComplete='off' />
<input onChange={handleInputChange} className={styles.input} type="password" name="pass" placeholder='Password' value={data.pass} required autoComplete='off' />
<button disabled={loading} type='submit' className={styles.btn}>LOGIN</button>
  </form>
</div>
<h1 className={styles.text}>Don't have an account?<NavLink to="/signup" className={styles.link}>SignUp</NavLink></h1>
   </section>
  )
}

export default Login