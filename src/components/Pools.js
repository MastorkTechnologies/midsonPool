import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { getPools, getPoolUsers } from '../firebase/config';
import { Link } from "react-router-dom";

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
    <h1>Pools</h1>
    {pools.length>0 && pools.map((pool,idx)=>{
        return (
            <>
            <Link to={`/updatePool/${pool.id}`} state={{ state:pool }} >
            <h3 style={{cursor:'pointer'}} key={pool.id} >{pool.poolAmount}</h3>
            </Link>
            {pool.usersAllData.map((user,idx)=>{
              return(<p key={user.email}>{user.name}</p>)
              
            })}
            </>
        )
    })}

    <button onClick={()=>navigate("/createPool")} >ADD NEW POOL</button>
    </>
  )
}

export default Pools