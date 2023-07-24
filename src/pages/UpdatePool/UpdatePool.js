import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { getPool, getPoolUser, getPoolUsers,updatePoolUserDuesold, updatePool, updatePoolUser, updatePoolUserDues, updatePoolUserTransaction } from '../../firebase/config';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useLocation } from 'react-router-dom';
import { Button, Form , Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import { current } from '@reduxjs/toolkit';
import ReactSwitch from 'react-switch';

const animatedComponents = makeAnimated();

const UpdatePool = () => {
  // const [name, setName] = useState();
  const [startingDate, setStartingDate] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [poolAmount, setPoolAmount] = useState();
  const [isloading,setIsloading] = useState(false); 
  const [pool, setPool] = useState();
  const [bidding, setBidding] = useState();
  const [showPrizedForm, setShowPrizedForm] = useState(false);
  const [showPrizedNotPaidForm, setShowPrizedNotPaidForm] = useState(false);
  const [showNonPrizedFinanceForm, setShowNonPrizedFinanceForm] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedPrizedUsers, setSelectedPrizedUsers] = useState([]);
  const [selectedNonPrizedFinanceUsers, setSelectedNonPrizedFinanceUsers] = useState([]);
  const [prizedUserDetails, setPrizedUserDetails] = useState([]);
  const [prizedNotPaidUsersDetails, setPrizedNotPaidUsersDetails] = useState([]);
  const [nonPrizedUserDetails, setNonPrizedUserDetails] = useState([]);
  const [nonPrizedFinanceUserDetails, setNonPrizedFinanceUserDetails] = useState([]);
  const [duePayments, setDuePayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paidVal, setPaidVal] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const params = useParams();
  const navigate=useNavigate()
  let { state } = useLocation();
  console.log(state.state)
  useEffect(()=>{
    getpool(params.id)
  },[])

  const getpool = async(id) =>{
    
    var res = state.state;
    setForm(res);
    intializeOptions(res.nonPrizedUsers);
  }
  
  const intializeOptions = (arr)=>{
    var res =[];
    arr.map((user,idx)=>{
      res[idx] = {value:user.email,label:user.name} 
    })
    setOptions(res)
  }
  
  const submitHandler = (e)=>{
    e.preventDefault();
    navigate("/dashboard");
  }
  const setForm = (data)=>{
    // setName(data.name);
    setPool(data);
    setCurrentMonth(data.currentMonth);
    setStartingDate(data.startingDate);
    setPoolAmount(data.poolAmount);
    getprizedUserDetails(data);
    getnonprizedUserDetails(data);
    getprizedNotPaidUserDetails(data);
    getnonprizedfinanceUserDetails(data);
    getduepayments(data);
    gettransactions(data)
  }
  const updateForm = ()=>{
    // setName(data.name);
    // setPool(data);
    setStartingDate(pool.startingDate);
    setPoolAmount(pool.poolAmount);
    getprizedUserDetails(pool);
    getnonprizedUserDetails(pool);
    getprizedNotPaidUserDetails(pool);
    getnonprizedfinanceUserDetails(pool);
    getduepayments(pool);
    gettransactions(pool)
  }

  const getprizedUserDetails = (data)=>{
    if(data?.prizedUsers.length>0){
      data.prizedUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setPrizedUserDetails((prizedUserDetails)=>[...prizedUserDetails, {email:item.email, amount:item.amount, name:user.name}])
          }
        })
      })
    }
  }
  const getnonprizedUserDetails = (data)=>{
    // if(data?.nonPrizedUsers.length>0){
    //   data.nonPrizedUsers.map((item,idx)=>{
    //     data.usersAllData.map((user, idx2)=>{
    //       if(item.email == user.email){
    //         setNonPrizedUserDetails((nonPrizedUserDetails)=> [...nonPrizedUserDetails, {email:item.email, name:user.name}])
    //       }
    //     })
    //   })
    // }
    if(data)
    setNonPrizedUserDetails([...data.nonPrizedUsers])

    console.log( [...data.nonPrizedUsers])
  }
  const getprizedNotPaidUserDetails = (data)=>{
    if(data.prizedNotPaidUsers.length>0){
      data.prizedNotPaidUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setPrizedNotPaidUsersDetails((prizedNotPaidUsersDetails)=> [...prizedNotPaidUsersDetails, {email:item.email, amount:item.amount, name:user.name}])
          }
        })
      })
    }
  }
  const getnonprizedfinanceUserDetails = (data)=>{
    if(data.nonPrizedFinanceUsers.length>0){
      data.nonPrizedFinanceUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setNonPrizedFinanceUserDetails((nonPrizedFinanceUserDetails)=> [...nonPrizedFinanceUserDetails, {email:item.email, amount:item.amount, name:user.name}])
          }
        })
      })
    }
  }
  const getduepayments = (data)=>{
    if(data.duePayments.length>0){
      data.duePayments.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setDuePayments((duepay)=> [...duepay, {email:item.email, amount:item.amount, date:item.date, name:user.name, paid:item.paid}])
          }
        })
      })
    }
  }

  const gettransactions = (data)=>{
    if(data.transactions.length>0){
      data.transactions.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setTransactions((transactions)=>[...transactions, {desc:item.desc ,email:item.email, amount:item.amount, name:user.name, status:item.status, date:item.date}])
          }
        })
      })
    }
  }
  const resetForm = ()=>{
    window.location.reload();
  }

  const updatePrizedNotPaidUsers = ()=>{
    if(bidding==undefined||bidding==""||bidding==null||selectedPrizedUsers==0){
      return toast.error("Bidding Amount or Prized User list cannot be empty!")
    }
    if(selectedPrizedUsers>1){
      return toast.error("Prized users cannot be more than One in a Month!")
    }
    if(pool.lastBidding && bidding < pool.lastBidding ){
      return toast.error(`Last Bidding Amount was ${pool.lastBidding}!`)
    }
    var monthlyPot = Number(pool.poolAmount) / pool.totalMonth;
    if(monthlyPot < bidding){
      return toast.error(`Bidding Amount cannot be greater than ${monthlyPot}!`)
    }
      var date = new Date();
      var year = date.getFullYear();
      var day = date.getDate();
      var month = date.getMonth();
      month +=1;
      var d =`${year}-${month}-${day}`
    setPool(pool.prizedNotPaidUsers=[...pool.prizedNotPaidUsers,{email:selectedPrizedUsers[0],date:d,amount:bidding}])
    setPool(pool.bidding=[...pool.bidding,bidding])
    setPool(pool.lastBidding=bidding)
    var temparr = [];
    pool.nonPrizedUsers.map((user,idx)=>{
      if(selectedPrizedUsers.includes(user.email)==false){
       
        temparr = [...temparr, user]
        
      }
    })
    setPool(pool.nonPrizedUsers=temparr);
   
    var amountRec = (monthlyPot-bidding) / pool.totalMonth;

    var monthlyPay = monthlyPot/ pool.totalMonth;

    var netPay = monthlyPay-amountRec;
    console.log(netPay, typeof(netPay))
    pool.users.map((user,idx)=>{
      setPool(pool.duePayments=[...pool.duePayments,{email:user, amount:netPay, paid:false, date:d}])
      updatePoolUserDues(user, {pool:pool.id, Amount:netPay, Paid:false, date:d})
    })
    
    var tempPool = pool;
    delete tempPool.usersAllData;
    // updateForm();
    updatePool(pool.id,tempPool, setIsloading)
    toast.success("updated prized user successfully")
    setShowPrizedNotPaidForm(false)
    setTimeout(resetForm, 3500);
  }

  const updatePrizedUsers = ()=>{
    if(bidding==undefined||bidding==""||bidding==null||selectedPrizedUsers==0){
      return toast.error("Bidding Amount or Prized User list cannot be empty!")
    }
    if(selectedPrizedUsers>1){
      return toast.error("Prized users cannot be more than One in a Month!")
    }
    if(pool.lastBidding && bidding < pool.lastBidding ){
      return toast.error(`Last Bidding Amount was ${pool.lastBidding}!`)
    }
    var monthlyPot = Number(pool.poolAmount) / pool.totalMonth;
    if(monthlyPot < bidding){
      return toast.error(`Bidding Amount cannot be greater than ${monthlyPot}!`)
    }
      var date = new Date();
      var year = date.getFullYear();
      var day = date.getDate();
      var month = date.getMonth();
      month +=1;
      var d =`${year}-${month}-${day}`
    setPool(pool.prizedUsers=[...pool.prizedUsers,{email:selectedPrizedUsers[0],date:d,amount:bidding}])
    setPool(pool.bidding=[...pool.bidding,bidding])
    setPool(pool.lastBidding=bidding)
    var temparr = [];
    pool.nonPrizedUsers.map((user,idx)=>{
      if(selectedPrizedUsers.includes(user.email)==false){
       
        temparr = [...temparr, user]
        
      }
    })
    setPool(pool.nonPrizedUsers=temparr);
    setPool(pool.balance=pool.balance-bidding);
   
    var amountRec = (monthlyPot-bidding) / pool.totalMonth;

    

    var monthlyPay = monthlyPot/ pool.totalMonth;
    console.log(monthlyPay, typeof(monthlyPay))

    var netPay = monthlyPay-amountRec;
    console.log(netPay, typeof(netPay))
    pool.users.map((user,idx)=>{
      setPool(pool.duePayments=[...pool.duePayments,{email:user, amount:netPay, paid:false, date:d}])
      updatePoolUserDues(user, {pool:pool.id, Amount:netPay, Paid:false, date:d})
    })

    setPool(pool.transactions=[...pool.transactions, {email:selectedPrizedUsers[0], amount:bidding, status:"debit", date:d, desc:`send prized money to ${selectedPrizedUsers[0]}`}])
    updatePoolUserTransaction(selectedPrizedUsers[0],  {pool:pool.id, amount:bidding, status:"credit",date:d, desc:`Received prized money from pool: ${pool.id}`})
    
    var tempPool = pool;
    delete tempPool.usersAllData;
    // updateForm();
    updatePool(pool.id,tempPool, setIsloading)
    toast.success("updated prized user successfully")
    setShowPrizedForm(false)
    setTimeout(resetForm, 3500);
  }

  const updateNonPrizedFinanceUsers = ()=>{
    if(bidding==undefined||bidding==""||bidding==null||selectedNonPrizedFinanceUsers==0){
      return toast.error("Bidding Amount or Prized User list cannot be empty!")
    }
    if(selectedNonPrizedFinanceUsers>1){
      return toast.error("Prized users cannot be more than One in a Month!")
    }
    if(pool.lastBidding && bidding < pool.lastBidding ){
      return toast.error(`Last Bidding Amount was ${pool.lastBidding}!`)
    }
    var monthlyPot = Number(pool.poolAmount) / pool.totalMonth;
    if(monthlyPot < bidding){
      return toast.error(`Bidding Amount cannot be greater than ${monthlyPot}!`)
    }
      var date = new Date();
      var year = date.getFullYear();
      var day = date.getDate();
      var month = date.getMonth();
      month +=1;
      var d =`${year}-${month}-${day}`
    setPool(pool.nonPrizedFinanceUsers=[...pool.nonPrizedFinanceUsers,{email:selectedNonPrizedFinanceUsers[0],date:d,amount:bidding}])
   
    updatePoolUserDues(selectedNonPrizedFinanceUsers[0], {pool:pool.id, Amount:bidding, Paid:false, date:d})
    setPool(pool.duePayments=[...pool.duePayments,{email:selectedNonPrizedFinanceUsers, amount:bidding, paid:false, date:d}])

    setPool(pool.transactions=[...pool.transactions, {email:selectedNonPrizedFinanceUsers[0], amount:bidding, status:"debit", date:d, desc:`Financed money to ${selectedNonPrizedFinanceUsers[0]}`}])
    updatePoolUserTransaction(selectedNonPrizedFinanceUsers[0],  {pool:pool.id, amount:bidding, status:"credit",date:d, desc:"Received Fiananced Money"})
    
    var tempPool = pool;
    delete tempPool.usersAllData;
    // updateForm();
    updatePool(pool.id,tempPool, setIsloading)
    toast.success("updated prized user successfully")
    setShowNonPrizedFinanceForm(false)
    setTimeout(resetForm, 3500);
  }
  const handleChangeDT = (val,index)=>{
    setPaidVal((prev)=>[...prev, val])
    setIndexes((prev)=>[...prev, index])
    console.log(val, index);
    var temp = [];
    duePayments.map((item, idx)=>{
  
        temp[idx] = item;
        if(idx == index){
          temp[idx].paid = val;
        }
      
    })
    console.log(duePayments[0])
    setDuePayments([...temp])
    delete temp.name;
    var pooltemp = pool;
    pooltemp.duePayments = temp;
    console.log(pooltemp)
    setPool(pooltemp)
  }
  const handleUpdateDP = ()=>{
    var date = new Date();
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth();
    month +=1;
    var d =`${year}-${month}-${day}`
    console.log(pool)
    var totalamt = 0;
    indexes.map((idx)=>{
      updatePoolUserDuesold(duePayments[idx].email, {pool:pool.id, Amount:duePayments[idx].amount, Paid:true, date:duePayments[idx].date})
      totalamt += duePayments[idx].amount;
      setPool(pool.transactions=[...pool.transactions, {email:duePayments[idx].email, amount:duePayments[idx].amount, status:"credit", date:d, desc:`Recieved Money from ${duePayments[idx].email}`}])
      updatePoolUserTransaction(duePayments[idx].email,  {pool:pool.id, amount:duePayments[idx].amount, status:"debit",date:d, desc:"Send Money to Pool"})
    })
    
      var tempPool = pool;
      delete tempPool.usersAllData;
      console.log(tempPool)
       tempPool.balance = tempPool.balance + totalamt;
      // updateForm();
      updatePool(pool.id,tempPool, setIsloading)
      toast.success("updated due payments")
      setTimeout(()=>navigate("/dashboard"), 2000);
    
  }
  return (
  <>
    <Navbar/>
    <h3 style={{margin:"auto", textAlign:"center", marginTop:'2%', textTransform:'uppercase'}}>Pool Details</h3>
    <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
    <Form  onSubmit={(e)=>submitHandler(e)}>
      <Form.Group className="mb-3">
        <Form.Label>
          Pool Amount:
          <Form.Control type="text" value={poolAmount} disabled={true} />
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          Starting Date:
          <Form.Control type="text" value={startingDate} disabled={true}/>
        </Form.Label>
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>
          Current Month:
          <Form.Control type="text" value={currentMonth} disabled={true}/>
        </Form.Label>
        </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>
          users:
          <div className="card" style={{ margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {pool && pool.usersAllData?.length>0 && pool.usersAllData.map((user,idx)=>{
              return (
                <li style={{width:"220px"}} className="list-group-item"> <p  style={{cursor:'pointer', textTransform:'capitalize'}} key={user.email} >{user.name} </p></li>
              )
            })}
            </ul>
          </div>
        </Form.Label>
        </Form.Group>
        {!showPrizedForm?
        <Form.Group className="mb-3">
        <Form.Label>
          Prized users:
          <div className="card" style={{ margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {prizedUserDetails && prizedUserDetails.length>0 ? prizedUserDetails.map((item,idx2)=>{
          
              return (
                <li style={{width:"220px"}} className="list-group-item"> <p  style={{cursor:'pointer', textTransform:'capitalize'}} key={`${item.email} pu`} >{item.name} {item.amount} </p></li>
              )
            }):
            <li style={{width:"220px"}} className="list-group-item"> <p> No prized users yet</p></li>
            }
            </ul>
            <Button className='btn-light' onClick={()=>setShowPrizedForm(true)} >ADD Prized User</Button>
          </div>
        </Form.Label>
        </Form.Group>
        :
        <>
        <h5>Add Prized User</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            users:
          
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              onChange={(selected)=> selected.map((item, idx)=>{
                setSelectedPrizedUsers([...selectedPrizedUsers, item.value])
              })}
              isMulti
              options={options}
            />
          </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>
            Bidding Amount:
            <Form.Control type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
          </Form.Label>
          <Button onClick={()=>setShowPrizedForm(false)} >Back</Button>
          <Button onClick={()=>updatePrizedUsers()} >ADD</Button>
        </Form.Group>
        </>
        }
        <Form.Group className="mb-3">
        <Form.Label>
          Non Prized users:
          <div className="card" style={{ margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {nonPrizedUserDetails && nonPrizedUserDetails.length>0 ? nonPrizedUserDetails.map((item,idx2)=>{
             
              return (
                <li style={{width:"220px"}} className="list-group-item"> <p  style={{cursor:'pointer', textTransform:'capitalize'}} key={`${item.email} npu`} >{item.name}</p></li>
              )
            }):
            <li style={{width:"220px"}} className="list-group-item"> <p> No Non prized users</p></li>
            }
            </ul>
          </div>
        </Form.Label>
        </Form.Group>
        {!showPrizedNotPaidForm?
        <Form.Group className="mb-3">
        <Form.Label>
          Prized Not Paid users:
          <div className="card" style={{ margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {prizedNotPaidUsersDetails && prizedNotPaidUsersDetails.length>0 ? prizedNotPaidUsersDetails.map((item,idx2)=>{
              
              return (
                <li style={{width:"220px"}} className="list-group-item"> <p  style={{cursor:'pointer', textTransform:'capitalize'}} key={`${item.email} pnpu`} >{item.name} {item.amount} </p></li>
              )
            }):
            <li style={{width:"220px"}} className="list-group-item"> <p> No Prized Not Paid users</p></li>
            }
            </ul>
            <Button className='btn-light' onClick={()=>setShowPrizedNotPaidForm(true)} >ADD Prized Not Paid User</Button>
          </div>
        </Form.Label>
        </Form.Group>
        :
        <>
        <h5>ADD Prized Not Paid User</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            users:
          
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(selected)=> selected.map((item, idx)=>{
                  setSelectedPrizedUsers([...selectedPrizedUsers, item.value])
                })}
                isMulti
                options={options}
              />
          </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>
            Bidding Amount:
            <Form.Control type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
          </Form.Label>
          <Button onClick={()=>setShowPrizedNotPaidForm(false)} >Back</Button>
          <Button onClick={()=>updatePrizedNotPaidUsers()} >ADD</Button>
        </Form.Group>
        </>
        }
        {!showNonPrizedFinanceForm?
        <Form.Group className="mb-3">
        <Form.Label>
          Non Prized Finance users:
          <div className="card" style={{ margin:'auto', marginTop:"2%", marginBottom:'1%'}}>
            <ul className="list-group list-group-flush">
            {nonPrizedFinanceUserDetails && nonPrizedFinanceUserDetails.length>0 ? nonPrizedFinanceUserDetails.map((item,idx2)=>{
             
              return (
                <li style={{width:"220px"}} className="list-group-item"> <p  style={{cursor:'pointer', textTransform:'capitalize'}} key={`${item.email} npfu`} >{item.name} {item.amount} </p></li>
              )
            }):
            <li style={{width:"220px"}} className="list-group-item"> <p> No Non Prized Finance users</p></li>
            }
            </ul>
            <Button className='btn-light' onClick={()=>setShowNonPrizedFinanceForm(true)} >ADD Prized Not Paid User</Button>
          </div>
        </Form.Label>
        </Form.Group>
        :
        <>
        <h5>ADD NON Prized Finance User</h5>
        <Form.Group className="mb-3">
          <Form.Label>
            users:
          
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(selected)=> selected.map((item, idx)=>{
                  setSelectedNonPrizedFinanceUsers([...selectedNonPrizedFinanceUsers, item.value])
                })}
                isMulti
                options={options}
              />
          </Form.Label>
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>
            Bidding Amount:
            <Form.Control type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
          </Form.Label>
          <Button onClick={()=>setShowNonPrizedFinanceForm(false)} >Back</Button>
          <Button onClick={()=>updateNonPrizedFinanceUsers()} >ADD</Button>
        </Form.Group>
        </>
        }
        
        <Button type="submit" value="Submit"  > Save </Button>
      </Form >
      </div>
      <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
        <h4>Due Payments</h4>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Paid</th>
        </tr>
      </thead>
      <tbody>
        {duePayments && duePayments.length> 0 && 
          duePayments.map((payment, idx2)=>{
        
           
            return(
              <tr key={`${Math.floor(Math.random() * 1092)}`}>
              <td>{idx2}</td>
              <td>{payment.name}</td>
              <td>{payment.date}</td>
              <td>{payment.amount}</td>
              <td>
              <ReactSwitch
                checked={payment.paid}
                onChange={(e)=>handleChangeDT(e, idx2)}
              />
              </td>
            </tr>
            )
          })
        }
        
      </tbody>
    </Table>
    <Button onClick={handleUpdateDP} style={{width:'250px',margin:'auto',display:'flex', justifyContent:'center' }} value="Submit"  > Update </Button>
      </div>
      <div className="card" style={{width:"60%", margin:'auto', marginTop:"2%", marginBottom:'1%', padding:'2% 8%'}}>
        <h4>Transactions</h4>
        <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions && transactions.length> 0 && 
          transactions.map((payment, idx)=>{
            
            if(idx<transactions.length)
            return(
              <tr>
              <td>{idx}</td>
              <td>{payment.desc}</td>
              <td>{payment.name}</td>
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

export default UpdatePool;