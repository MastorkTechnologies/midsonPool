import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { createPoolUser } from '../../firebase/config';
import { Button , Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
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
        duePayments:[],
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
    setTimeout(()=>window.location.reload(), 1500);
  }
  return (
  <>
    <Navbar/>
    <h3 style={{margin:"auto", textAlign:"center"}}>ADD MEMBER</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
    <Form  onSubmit={(e)=>submitHandler(e)}>
      <Form.Group className="mb-3">
        <Form.Label>
          Name:
          <Form.Control type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Email:
          <Form.Control type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Phone:
          <Form.Control type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </Form.Label>
        </Form.Group>
        <Button type="submit" value="Submit"> ADD </Button>
      </Form >
      </div>

  </>
  )
}

export default CreateUser;