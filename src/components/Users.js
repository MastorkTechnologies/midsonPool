import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { getPoolUsers } from '../firebase/config';

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
    <h1>Users</h1>
    {users.length>0 && users.map((user,idx)=>{
        return (
            <h3 onClick={()=>navigate(`/updateUser/${user.email}`)} style={{cursor:'pointer'}} key={user.email} >{user.name}</h3>
        )
    })}

    <button onClick={()=>navigate("/createUser")} >ADD USER</button>
    </>
  )
}

export default Users