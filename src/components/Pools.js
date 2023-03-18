import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { getPools, getPoolUsers } from '../firebase/config';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
const Pools = () => {
    const [pools, setPools] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate=useNavigate()

    const getpools = async (data)=>{
      var res = await getPools();
        console.log(res);
        await res.map((pool,idx)=>{
          pool.users.map((email,idx1)=>{
            data.map((user,idx2)=>{
              if(email == user.email){
                if(pool.usersAllData)
                pool.usersAllData = [...pool.usersAllData,user];
                else
                pool.usersAllData = [user];
              }
            })
          })
         })
        console.log(res);
        setPools(res);
    }
    const getusers = async()=>{
      var res = await getPoolUsers();
        setUsers(res);
        getpools(res);
    }

    useEffect(()=>{
        getusers();
    },[])

  return (
    <>
    <h3 style={{margin:"auto", marginTop:'2%', textAlign:"center"}}>Groups</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
    <ul className="list-group list-group-flush">
    {pools.length>0 && pools.map((pool,idx)=>{
        return (
           
            <li className="list-group-item" >
            <Link style={{textDecoration:'none', color:'black' , textAlign:'center'}} to={`/updatePool/${pool.id}`} state={{ state:pool }} >
            <h4 style={{cursor:'pointer'}} key={pool.id} > Group Amount ₹{((pool.poolAmount/pool.totalMonth)/pool.users.length).toFixed(2)} <span style={{color:'lightgray'}} > #{pool.id}</span> </h4>
            </Link>
            <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {pool.usersAllData.map((user,idx)=>{
              return(
              <li className="list-group-item" >
                <p style={{ textTransform:'capitalize'}} key={user.email}>{user.name}</p>
              </li>
              )
              
            })}
            </ul>
            </div>
            </li>
        )
    })}
     </ul>
    </div>
    <Button className='btn-dark' style={{margin:'auto',display:'flex', justifyContent:'center' }} onClick={()=>navigate("/createPool")} >ADD NEW GROUP</Button>
    </>
  )
}

export default Pools