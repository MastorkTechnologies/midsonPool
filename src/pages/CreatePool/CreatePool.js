import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { createPool, createPoolUser, getPoolIDs, getPoolUsers, updatePoolIDs, updatePoolUserGroup } from '../../firebase/config';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Button, Form  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const animatedComponents = makeAnimated();

const CreatePool = () => {
  const [poolAmount, setPoolAmount] = useState();
  const [validID, setValidID] = useState(false);
  const [poolID, setPoolID] = useState();
  const [ids, setIds] = useState([]);
  const [totalMonths, setTotalMonths] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [nonPrizedUsers, setNonPrizedUsers] = useState([]);
  const [startingDate, setStartingDate] = useState();
  const [options, setOptions] = useState([]);
  const navigate=useNavigate()

  useEffect(()=>{
    intializeUsers();
  },[])

  // useEffect(()=>{
  //   var arr = []
    
  //   nonPrizedUsers.length>0 && nonPrizedUsers.map((u)=>{
  //     arr.push(u.email)
  //   })
  //   console.log("arr", arr)
  //   users.map((user,idx)=>{
  //     selectedUsers.map((email, idx2)=>{
  //       console.log("current", user)
  //       console.log((arr.includes(user.email)==false))
  //       if(arr.includes(user.email)==false)
  //       if(user.email == email){
  //         setNonPrizedUsers((prev)=> [...prev, {email:user.email, name: user.name}])
  //         arr.push(user.email)
  //       }
  //     })
  //   })
  // },[selectedUsers])
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
    // var id = randomStr();
    var temparr = [];
    
    users.map((u)=>{
      if(selectedUsers.includes(u.email)){
        temparr.push({email:u.email, name: u.name})
      }
    })

    console.log(selectedUsers, temparr)

    // var data = {
    //     id:poolID,
    //     poolAmount:poolAmount*totalMonths,
    //     users:selectedUsers,
    //     balance:0,
    //     latePayers:[],
    //     transactions:[],
    //     prizedUsers:[],
    //     prizedNotPaidUsers:[],
    //     nonPrizedUsers:temparr,
    //     nonPrizedFinanceUsers:[],
    //     currentMonth:1,
    //     bidding:[],
    //     lastBidding:0,
    //     startingDate,
    //     totalMonth:totalMonths,
    //     duePayments:[],
    // }
    // updatePoolIDs(poolID,ids)
    // createPool(poolID, data)
    // selectedUsers.map((email,idx)=>{
    //   users.map((user, idx2)=>{
    //     if(email == user.email){
    //       var temp = {pools:[...user.pools,poolID]}
    //       updatePoolUserGroup(email,temp)
    //     }
    //   })
    // })
    
    // toast.success("Pool Created!")
    // setTimeout(resetForm, 3500);
    
  }

  const intializeUsers = async()=>{
    var res = await getPoolUsers();
    setUsers(res);
    intializeOptions(res);
    var temp = await getPoolIDs();
    setIds(temp.ids);
  }

  const resetForm = ()=>{
    window.location.reload();
  }

  const checkID = ()=>{
    if(ids.includes(poolID)){
      toast.error("ID Already exists!")
      setValidID(false)
    }
    else if(poolID.length<6){
      toast.error("ID must have atleast 6 characters")
      setValidID(false)
    }else{
      toast.success("Valid ID");
      setValidID(true)
    }
  }
  return (
  <>
    <Navbar/>
    <h3 style={{margin:"auto", textAlign:"center", marginTop:'2%', textTransform:'uppercase'}}>ADD NEW POOL</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
    <Form  onSubmit={(e)=>submitHandler(e)}>
    <Form.Group className="mb-3">
        <Form.Label>
        Group ID:
          <Form.Control type="text" value={poolID} onChange={(e)=>setPoolID(e.target.value)} />
        </Form.Label>
          <Button onClick={checkID} value="Submit" > check ID </Button>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
        Group Amount:
          <Form.Control type="text" value={poolAmount} onChange={(e)=>setPoolAmount(e.target.value)} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
        Users:
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            onChange={(selected)=> {selected.map((item, idx)=>{
              setSelectedUsers([...selectedUsers, item.value])
            })
              setTotalMonths(selected.length)
              }
            }
            isMulti
            options={options}
          />
        </Form.Label>
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>
        No of Months:
          <Form.Control type="text" value={totalMonths} onChange={(e)=>setTotalMonths(e.target.value)} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Starting Date:
          <Form.Control type="date" value={startingDate} onChange={(e)=>setStartingDate(e.target.value)}/>
        </Form.Label>
        </Form.Group>
        <Button disabled={!validID} type="submit" value="Submit" > ADD </Button>
      </Form >
      </div>
  </>
  )
}

export default CreatePool;