import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { getPoolUser, updatePoolUser } from '../../firebase/config';
import { Button, Form , Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const UpdateUser = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [user, setUser] = useState();
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
    setUser(data)
  }
  return (
  <>
    <Navbar/>
    <h3 style={{margin:"auto", textAlign:"center", marginTop:'2%', textTransform:'uppercase'}}>User Details</h3>
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
          <Form.Control type="text" value={email} onChange={(e)=>setEmail(e.target.value)} disabled={true}/>
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Phone:
          <Form.Control type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </Form.Label>
        </Form.Group>
        <Button type="submit" value="Submit" disabled={isloading} > Update </Button>
      </Form >
      </div>
      <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
        <h4>Due Payments</h4>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Pool ID</th>
          <th>Date</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {user && user.duePayments.length> 0 && 
          user.duePayments.map((payment, idx)=>{
            return(
              <tr>
              <td>{idx}</td>
              <td>{payment.pool}</td>
              <td>{payment.date}</td>
              <td>{payment.Amount}</td>
            </tr>
            )
          })
        }
        
      </tbody>
    </Table>
      </div>
      <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
        <h4>Transactions</h4>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Pool ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {user && user.transactions.length> 0 && 
          user.transactions.map((payment, idx)=>{
            return(
              <tr>
              <td>{idx}</td>
              <td>{payment.desc}</td>
              <td>{payment.pool}</td>
              <td>{payment.date}</td>
              <td>{payment.amount}</td>
              <td>{payment.status}</td>
            </tr>
            )
          })
        }
        
      </tbody>
    </Table>
      </div>
  </>
  )
}

export default UpdateUser;