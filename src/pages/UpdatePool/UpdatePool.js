import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { toast } from 'react-toastify';
import { getPool, getPoolUser, getPoolUsers, updatePool, updatePoolUser, updatePoolUserTransaction } from '../../firebase/config';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useLocation } from 'react-router-dom';

const animatedComponents = makeAnimated();

const UpdatePool = () => {
  // const [name, setName] = useState();
  const [startingDate, setStartingDate] = useState();
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

  }
  const setForm = (data)=>{
    // setName(data.name);
    setPool(data);
    setStartingDate(data.startingDate);
    setPoolAmount(data.poolAmount);
    getprizedUserDetails(data);
    getnonprizedUserDetails(data);
    getprizedNotPaidUserDetails(data);
    getnonprizedfinanceUserDetails(data);
    getduepayments(data);
    gettransactions(data)
  }

  const getprizedUserDetails = (data)=>{
    if(data?.prizedUsers.length>0){
      data.prizedUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setPrizedUserDetails([...prizedUserDetails, {email:item.email, amount:item.amount, name:user.name}])
          }
        })
      })
    }
  }
  const getnonprizedUserDetails = (data)=>{
    if(data?.nonPrizedUsers.length>0){
      data.nonPrizedUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setNonPrizedUserDetails([...nonPrizedUserDetails, {email:item.email, name:user.name}])
          }
        })
      })
    }
  }
  const getprizedNotPaidUserDetails = (data)=>{
    if(data.prizedNotPaidUsers.length>0){
      data.prizedNotPaidUsers.map((item,idx)=>{
        data.usersAllData.map((user, idx2)=>{
          if(item.email == user.email){
            setPrizedNotPaidUsersDetails([...prizedNotPaidUsersDetails, {email:item.email, amount:item.amount, name:user.name}])
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
            setNonPrizedFinanceUserDetails([...nonPrizedFinanceUserDetails, {email:item.email, amount:item.amount, name:user.name}])
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
            setDuePayments((duepay)=> [...duepay, {email:item.email, amount:item.Amount, name:user.name, paid:item.Paid}])
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
            setTransactions([...transactions, {email:item.email, amount:item.amount, name:user.name, status:item.status, date:item.date}])
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
      selectedPrizedUsers.map((email,idx2)=>{
        if(email != user.email){
          temparr = [...temparr, user]
        }
      })
    })
    setPool(pool.nonPrizedUsers=temparr);
   
    var amountRec = (monthlyPot-bidding) / pool.totalMonth;

    var monthlyPay = monthlyPot/ pool.totalMonth;

    var netPay = monthlyPay-amountRec;
    console.log(netPay, typeof(netPay))
    pool.users.map((user,idx)=>{
      setPool(pool.duePayments=[...pool.duePayments,{email:user, Amount:netPay, Paid:false}])
    })
    
    var tempPool = pool;
    delete tempPool.usersAllData;
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
      selectedPrizedUsers.map((email,idx2)=>{
        if(email != user.email){
          temparr = [...temparr, user]
        }
      })
    })
    setPool(pool.nonPrizedUsers=temparr);
    setPool(pool.balance=pool.balance-bidding);
   
    var amountRec = (monthlyPot-bidding) / pool.totalMonth;

    

    var monthlyPay = monthlyPot/ pool.totalMonth;
    console.log(monthlyPay, typeof(monthlyPay))

    var netPay = monthlyPay-amountRec;
    console.log(netPay, typeof(netPay))
    pool.users.map((user,idx)=>{
      setPool(pool.duePayments=[...pool.duePayments,{email:user, Amount:netPay, Paid:false}])
    })

    setPool(pool.transactions=[...pool.transactions, {email:selectedPrizedUsers[0], amount:bidding, status:"debit", date:d}])
    updatePoolUserTransaction(selectedPrizedUsers[0],  {pool:pool.id, amount:bidding, status:"credit",date:d})
    
    var tempPool = pool;
    delete tempPool.usersAllData;
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
    setPool(pool.prizedUsers=[...pool.prizedUsers,{email:selectedNonPrizedFinanceUsers[0],date:d,amount:bidding}])
   

    setPool(pool.duePayments=[...pool.duePayments,{email:selectedNonPrizedFinanceUsers, Amount:bidding, Paid:false}])

    setPool(pool.transactions=[...pool.transactions, {email:selectedNonPrizedFinanceUsers[0], amount:bidding, status:"debit", date:d}])
    updatePoolUserTransaction(selectedNonPrizedFinanceUsers[0],  {pool:pool.id, amount:bidding, status:"credit",date:d})
    
    var tempPool = pool;
    delete tempPool.usersAllData;
    updatePool(pool.id,tempPool, setIsloading)
    toast.success("updated prized user successfully")
    setShowNonPrizedFinanceForm(false)
    setTimeout(resetForm, 3500);
  }
  return (
  <>
    <Navbar/>
    <h1>Pool Details</h1>
    <form onSubmit={(e)=>submitHandler(e)}>
        <label>
          Pool Amount:
          <input type="text" value={poolAmount} disabled={true} />
        </label>
       
        <label>
          Starting Date:
          <input type="text" value={startingDate} disabled={true}/>
        </label>
        <br></br>
        <label>
          users:
          {pool?.usersAllData?.map((user,idx)=>{
            return(
              <p key={user.email} >{user.name}</p>
            )
          })}
        </label>
        {
          !showPrizedForm?
          <label>
            Prized users:
            {pool?.prizedUsers.length >0?
           
              prizedUserDetails.map((item,idx2)=>{
               
                return(
                  <p key={item.email} >{item.name} {item.amount}</p>
                )
            }):
            <p>No prized users yet</p>
            } 
            <br></br>
            <button onClick={()=>setShowPrizedForm(true)} >ADD Prized User</button>
          </label>
          :
          <>
          <label>
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
          </label>
          <label>
            Bidding Amount:
            <input type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
          </label>
          <button onClick={()=>setShowPrizedForm(false)} >Back</button>
          <button onClick={()=>updatePrizedUsers()} >Update</button>
          </>
        }
        <br></br>
        <label>
            Non Prized users:
            {nonPrizedUserDetails.length >0?
           
              nonPrizedUserDetails.map((item,idx2)=>{
               
                return(
                  <p key={item.email} >{item.name}</p>
                )
            }):
            <p>No Non prized users </p>
            } 
          </label>
          
          {
            !showPrizedNotPaidForm?
            <label>
            Prized Not Paid users:
            {prizedNotPaidUsersDetails.length >0?
           
              prizedNotPaidUsersDetails.map((item,idx2)=>{
               
                return(
                  <p key={item.email} >{item.name} {item.amount}</p>
                )
            }):
            <p>No Prized Not Paid users</p>
            }
            <button onClick={()=>setShowPrizedNotPaidForm(true)} >ADD Prized Not Paid User</button>
            </label>
            :
            <>
            <label>
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
            </label>
            <label>
              Bidding Amount:
              <input type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
            </label>
            <button onClick={()=>setShowPrizedNotPaidForm(false)} >Back</button>
            <button onClick={()=>updatePrizedNotPaidUsers()} >Update</button>
            </>
          }
          <br></br>
          {
            !showNonPrizedFinanceForm?
            <label>
            Non Prized Finance users:
            {nonPrizedFinanceUserDetails.length >0?
           
              nonPrizedFinanceUserDetails.map((item,idx2)=>{
               
                return(
                  <p key={item.email} >{item.name} {item.amount}</p>
                )
            }):
            <p>No Non Prized Finance users</p>
            }
            <button onClick={()=>setShowNonPrizedFinanceForm(true)} >ADD NON Prized Finance User</button>
            </label>
            :
            <>
            <label>
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
            </label>
            <label>
              Amount:
              <input type="text" value={bidding} onChange={(e)=>setBidding(e.target.value)} />
            </label>
            <button onClick={()=>setShowNonPrizedFinanceForm(false)} >Back</button>
            <button onClick={()=>updateNonPrizedFinanceUsers()} >Update</button>
            </>
          }
            <br></br>
            <label>
            Due Payments:
            {duePayments.length >0?
           
              duePayments.map((item,idx2)=>{
                if(idx2<duePayments.length/2)
                return(
                  <p key={item.email} >{item.name} {item.amount} {item.paid?"":"not"} paid </p>
                )
            }):
            <p>No Due Payments</p>
            }
            {/* <button onClick={()=>setShowNonPrizedFinanceForm(true)} >ADD NON Prized Finance User</button> */}
            </label>
            <label>
            Transactions:
            {transactions.length >0?
           
              transactions.map((item,idx2)=>{
               
                return(
                  <p key={item.email} >{item.date} {item.name} {item.amount} {item.status}  </p>
                )
            }):
            <p>No Transactions yet</p>
            }
            {/* <button onClick={()=>setShowNonPrizedFinanceForm(true)} >ADD NON Prized Finance User</button> */}
            </label>
        {/* <input type="submit" value="Submit" disabled={isloading} /> */}
      </form>
  </>
  )
}

export default UpdatePool;