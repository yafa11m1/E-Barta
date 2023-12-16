
'use client'
import { useContext, createContext, useState, useEffect} from "react";
import { auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    status,
     } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
 
    const [user, setUser] = useState(null);
    const [isLoggedIn, setLoggedin] = useState(null);
    const placeholderurl = "https://firebasestorage.googleapis.com/v0/b/e-barta.appspot.com/o/Placeholder.png?alt=media&token=5e9184bc-bc33-41a9-ab06-49a8aed664bc&_gl=1*b11nkl*_ga*MTEzMzEyNzczLjE2OTgwNDAzNTA.*_ga_CW55HF8NVT*MTY5ODIyMDU1Ni4xOC4xLjE2OTgyMjA1NzAuNDYuMC4w";


    useEffect( () => {
        const unsubscribe =   onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          currentUser?sessionStorage.setItem("uid",currentUser.uid):"";
        });
        return ()=>  unsubscribe();
      }, [user]);
  return (
    <AuthContext.Provider value={{auth, user,
        db,
        signInWithGoogle,
        logInWithEmailAndPassword,
        registerWithEmailAndPassword,
        sendPasswordReset,
        logout,
        status,
        isLoggedIn,setLoggedin,
        placeholderurl }}>
    
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};