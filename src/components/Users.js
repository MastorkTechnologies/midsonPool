import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { getPoolUsers } from '../firebase/config';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate=useNavigate()

    const getusers = async ()=>{
      var res = await getPoolUsers(); 
        setUsers(res);
    }

    useEffect(()=>{
        getusers();
    },[])

  return (
    <>
    <h3 style={{margin:"auto", textAlign:"center"}}>Members</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
      <ul className="list-group list-group-flush">
      {users.length>0 && users.map((user,idx)=>{
        return (
          <li className="list-group-item"> <h4 onClick={()=>navigate(`/updateUser/${user.email}`)} style={{cursor:'pointer', textTransform:'capitalize'}} key={user.email} >{user.name} <Button style={{color:'#03AC13', float:'right'}} className='btn-light' onClick={()=>navigate(`/updateUser/${user.email}`)}>View</Button> <Button style={{color:'#0492C2', float:'right'}} className='btn-light'onClick={()=>navigate(`/updateUser/${user.email}`)} >Edit</Button> </h4></li>
        )
      })}
      </ul>
    </div>

    <Button className='btn-dark' style={{margin:'auto',display:'flex', justifyContent:'center' }} onClick={()=>navigate("/createUser")} >ADD NEW MEMBER</Button>

    </>
  )
}

export default Users