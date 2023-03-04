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