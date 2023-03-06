import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { createPoolUser } from '../../firebase/config';

const CreateUser = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const navigate=useNavigate()

  const submitHandler = (e)=>{
    e.preventDefault();
    if(name == null || email == null || name == "" || email== ""){
       return toast.error("Name or Email cannot be empty!")
    }
    var data = {
        name,
        email,
        phone,
        pools:[],
        transactions:[]
    }
    createPoolUser(email, data)
    toast.success("User Added")
    resetForm();
  }

  const resetForm = ()=>{
    setName("");
    setEmail("");
    setPhone("");
  }
  return (
  <>
    <Navbar/>
    <h1>Create user</h1>
    <form onSubmit={(e)=>submitHandler(e)}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
       
        <label>
          Email:
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
       
        <label>
          Phone:
          <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
  </>
  )
}

export default CreateUser;