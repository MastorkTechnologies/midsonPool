
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes} from 'react-router-dom'
import { auth } from './firebase/config'

import Dashboard from './pages/Dashboard/Dashboard'
import EditProfile from './pages/Edit Profile/EditProfile'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import { login, logout } from './redux/userSlice'


const App = () => {
const dispatch=useDispatch()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          login({
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <Routes>
     <Route path="/" element={<Login />} />
     <Route path="/signup" element={<Signup />} />
     <Route path='/dashboard' element={<Dashboard/>}/>
     <Route path='/editProfile' element={<EditProfile/>}/>
     </Routes> 
  )
}

export default App