import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { DocumentReference, getFirestore } from "firebase/firestore";
import {
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  setDoc,
  collection,
  getDoc,
} from "firebase/firestore";

import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
import { toast } from "react-toastify";

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db,storage };

export const getUserFromDatabase = async (email) => {
    //let User;
    const docRef = doc(db, "Users", email);
    const docSnap = await getDoc(docRef);
    //console.log(docSnap.data(), "docSnap");
    return docSnap.data();
  };

export const createUserInDataBase=async(email,data)=>{
  try {
    await setDoc(
        doc(db, "Users", email),data)       
} catch (error) {
  console.log(error.message)
}
}

export const updateUserInDataBase=async(email,data,setIsloading)=>{
  setIsloading(true)
  const userDocumentRef=doc(db,"Users",email)
  
  try {
   
    await updateDoc(userDocumentRef,{name:data.name,phoneNumber:data.number}) 
    toast.success("Successfully Updated")  
    setIsloading(false)   
} catch (error) {
  console.log(error.message)
  toast.error("Something went wrong")
  setIsloading(false) 
}
}
  export const uploadMedia = async (media, path) => {
    try {
      await uploadBytesResumable(ref(storage, `${path}/${media.name}`), media);
      const getMedia = await ref(storage, `${path}/${media.name}`);
      const mediaLink = await getDownloadURL(getMedia);
      return mediaLink;
    } catch (err) {
      console.log("Err: ", err);
    }
  };

  export const getPoolUsers = async () => {
    const colRef = collection(db, "poolUsers");
    const docsSnap = await getDocs(colRef);
    var result =[];
    docsSnap.forEach(doc => {
      result=[...result,doc.data()];
    })

    console.log("result", result[0])
    return result;
  };

  export const getPoolUser = async (email) => {
    //let User;
    const docRef = doc(db, "poolUsers", email);
    const docSnap = await getDoc(docRef);
    //console.log(docSnap.data(), "docSnap");
    return docSnap.data();
  };

  export const createPoolUser=async(email,data)=>{
    try {
      await setDoc(
          doc(db, "poolUsers", email),data)       
    } catch (error) {
    console.log(error.message)
    }
  }

  export const updatePoolUser=async(email,data,setIsloading)=>{
    setIsloading(true)
    const userDocumentRef=doc(db,"poolUsers",email)
    
    try {
     
      await updateDoc(userDocumentRef,{name:data.name,phone:data.phone}) 
      toast.success("Successfully Updated")  
      setIsloading(false)   
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong")
      setIsloading(false) 
    }
  }
  export const updatePoolUserGroup=async(email,data)=>{
    // setIsloading(true)
    const userDocumentRef=doc(db,"poolUsers",email)
    
    try {
     
      await updateDoc(userDocumentRef,{pools:[...data.pools]}) 
      // toast.success("Successfully Updated")  
      // setIsloading(false)   
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong")
      // setIsloading(false) 
    }
  }

  export const updatePoolUserTransaction=async(email,data)=>{
    // setIsloading(true)
    const userDocumentRef=doc(db,"poolUsers",email)
    const docRef = doc(db, "poolUsers", email);
    const docSnap = await getDoc(docRef);
    const userdata = docSnap.data();
    
    try {
     
      await updateDoc(userDocumentRef,{transactions:[...userdata.transactions,data]}) 
      // toast.success("Successfully Updated")  
      // setIsloading(false)   
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong while updating the transaction of user")
      // setIsloading(false) 
    }
  }
  export const updatePoolUserDues=async(email,data)=>{
    // setIsloading(true)
    const userDocumentRef=doc(db,"poolUsers",email)
    const docRef = doc(db, "poolUsers", email);
    const docSnap = await getDoc(docRef);
    const userdata = docSnap.data();
    
    try {
     
      await updateDoc(userDocumentRef,{duePayments:[...userdata.duePayments,data]}) 
      // toast.success("Successfully Updated")  
      // setIsloading(false)   
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong while updating the dues of user")
      // setIsloading(false) 
    }
  }
  export const updatePoolUserDuesold=async(email,data)=>{
    // setIsloading(true)
    const userDocumentRef=doc(db,"poolUsers",email)
    const docRef = doc(db, "poolUsers", email);
    const docSnap = await getDoc(docRef);
    const userdata = docSnap.data();
    var i;
    var temparr=[];
    for(i =0; i<userdata.duePayments.length; i++){
      if(data.Amount != userdata.duePayments[i].Amount || data.pool != userdata.duePayments[i].pool || data.date != userdata.duePayments[i].date){
        temparr = [...temparr, userdata.duePayments[i]]
      }
    }   
    
    try {
     
      await updateDoc(userDocumentRef,{duePayments:[...temparr]}) 
      // toast.success("Successfully Updated")  
      // setIsloading(false)   
    } catch (error) {
      console.log(error.message)
      toast.error("Something went wrong while updating the dues of user")
      // setIsloading(false) 
    }
  }

  export const getPools = async () => {
    const colRef = collection(db, "Pools");
    const docsSnap = await getDocs(colRef);
    var result =[];
    docsSnap.forEach(doc => {
      result=[...result,doc.data()];
    })
    return result;
  };

  export const getPool = async (id) => {
    //let User;
    const docRef = doc(db, "Pools", id);
    const docSnap = await getDoc(docRef);
    //console.log(docSnap.data(), "docSnap");
    return docSnap.data();
  };

  export const createPool=async(id,data)=>{
    try {
      await setDoc(
          doc(db, "Pools", id),data)       
    } catch (error) {
    console.log(error.message)
    }
  }

  
  export const updatePool=async(id,data,setIsloading)=>{
    setIsloading(true)
    
    try {
     
      await setDoc(
        doc(db, "Pools", id),data) 
      // toast.success("Successfully Updated")  
      setIsloading(false)   
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong while updating the pool")
      setIsloading(false) 
    }
  }