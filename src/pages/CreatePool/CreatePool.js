import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { createPool, createPoolUser, getPoolUsers, updatePoolUserGroup } from '../../firebase/config';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Button, Form  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const animatedComponents = makeAnimated();

const CreatePool = () => {
  const [poolAmount, setPoolAmount] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [nonPrizedUsers, setNonPrizedUsers] = useState([]);
  const [startingDate, setStartingDate] = useState();
  const [options, setOptions] = useState([]);
  const navigate=useNavigate()

  useEffect(()=>{
    intializeUsers();
    
  },[])

  useEffect(()=>{
    users.map((user,idx)=>{
      selectedUsers.map((email, idx2)=>{
        if(user.email == email){
          setNonPrizedUsers([...nonPrizedUsers, {email:user.email, name: user.name}])
        }
      })
    })
  },[selectedUsers])

  const intializeOptions = (arr)=>{
    var res =[];
    arr.map((user,idx)=>{
      res[idx] = {value:user.email,label:user.name} 
    })
    console.log("res",res)
    setOptions(res)
  }

  function randomStr() {
    var arr = ['1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    var ans = '';
    for (var i = 18; i > 0; i--) {
        ans +=
        arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
  }

  const submitHandler = (e)=>{
    e.preventDefault();
    if(poolAmount == null ||poolAmount == "" || selectedUsers.length<=0 || startingDate == null || startingDate == "" || startingDate == undefined){
       return toast.error("Pool Amount , users or Starting Date cannot be empty!")
    }
    var id = randomStr();


    var data = {
        id,
        poolAmount,
        users:selectedUsers,
        balance:0,
        latePayers:[],
        transactions:[],
        prizedUsers:[],
        prizedNotPaidUsers:[],
        nonPrizedUsers,
        nonPrizedFinanceUsers:[],
        currentMonth:1,
        bidding:[],
        lastBidding:0,
        startingDate,
        totalMonth:selectedUsers.length,
        duePayments:[],
    }
    createPool(id, data)
    selectedUsers.map((email,idx)=>{
      users.map((user, idx2)=>{
        if(email == user.email){
          var temp = {pools:[...user.pools,id]}
          updatePoolUserGroup(email,temp)
        }
      })
    })
    
    toast.success("Pool Created!")
    setTimeout(resetForm, 3500);
    
  }

  const intializeUsers = async()=>{
    var res = await getPoolUsers();
    setUsers(res);
    intializeOptions(res);
  }

  const resetForm = ()=>{
    window.location.reload();
  }
  return (
  <>
    <Navbar/>
    <h3 style={{margin:"auto", textAlign:"center", marginTop:'2%', textTransform:'uppercase'}}>ADD NEW POOL</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
    <Form  onSubmit={(e)=>submitHandler(e)}>
      <Form.Group className="mb-3">
        <Form.Label>
        Pool Amount:
          <Form.Control type="text" value={poolAmount} onChange={(e)=>setPoolAmount(e.target.value)} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
        Users:
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={(selected)=> selected.map((item, idx)=>{
              setSelectedUsers([...selectedUsers, item.value])
            })}
            isMulti
            options={options}
          />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Starting Date:
          <Form.Control type="date" value={startingDate} onChange={(e)=>setStartingDate(e.target.value)}/>
        </Form.Label>
        </Form.Group>
        <Button type="submit" value="Submit" > ADD </Button>
      </Form >
      </div>
  </>
  )
}

export default CreatePool;