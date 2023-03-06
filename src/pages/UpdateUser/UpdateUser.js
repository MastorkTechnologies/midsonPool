import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { getPoolUser, updatePoolUser } from '../../firebase/config';

const UpdateUser = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [isloading,setIsloading] = useState(false); 
  const params = useParams();
  const navigate=useNavigate()

  useEffect(()=>{
    getUser(params.email)
  },[])

  const submitHandler = (e)=>{
    e.preventDefault();
    if(name == null || email == null || name == "" || email== ""){
       return toast.error("Name cannot be empty!")
    }
    var data = {
        name,
        email,
        phone,
        pools:[],
        transactions:[]
    }
    updatePoolUser(email, data, setIsloading)
  }

  const getUser = async(email) =>{
    var res = await getPoolUser(email);
    setForm(res);
  }

  const setForm = (data)=>{
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
  }
  return (
  <>
    <Navbar/>
    <h1>Update user</h1>
    <form onSubmit={(e)=>submitHandler(e)}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
       
        <label>
          Email:
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={true}/>
        </label>
       
        <label>
          Phone:
          <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </label>
        <input type="submit" value="Submit" disabled={isloading} />
      </form>
  </>
  )
}

export default UpdateUser;