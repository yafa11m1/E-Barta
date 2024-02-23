import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBH-jWsHIz2sAm1DkxRYo6cXwKu_245dTU",
  authDomain: "e-barta.firebaseapp.com",
  projectId: "e-barta",
  storageBucket: "e-barta.appspot.com",
  messagingSenderId: "112896951156",
  appId: "1:112896951156:web:9f03afc2eb4eaca3c2a221",
  measurementId: "G-X2YD8283TK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


var isLoggedIn = false;
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("Uid", "==", user.uid));
    const docs = await getDocs(q);
    
    storeAuthToken();
    if (docs.docs.length === 0) {
      await setDoc(doc(db, "users",user.uid), {
            Uid:user.uid,
            Username:user.email,
            Fullname:user.displayName,
            Email:user.email,
            Gender:"",
            Phone:user.phoneNumber,
            PhotoUrl:user.photoURL,
            Chats:[],
            onlinestat:"online"
      });
      
    }
    isLoggedIn = true;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      // 
      storeAuthToken();
      return true
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      alert(errorMessage);
      return false;
      // ..
    });;
    


 
    
  } catch (err) {
    console.error(err);
    //alert(err.message);
    // status = "Email or password is incorrect ";

    return false;
    
  }
};

const registerWithEmailAndPassword = async (email, password,gender,phone, fullname) => {
  // 
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    await setDoc(doc(db, "users",user.uid), {
      Uid:user.uid,
      Fullname:fullname,
      Email:email,
      Gender:gender,
      Phone:phone,
      PhotoUrl:"https://firebasestorage.googleapis.com/v0/b/e-barta.appspot.com/o/Placeholder.png?alt=media&token=5e9184bc-bc33-41a9-ab06-49a8aed664bc&_gl=1*b11nkl*_ga*MTEzMzEyNzczLjE2OTgwNDAzNTA.*_ga_CW55HF8NVT*MTY5ODIyMDU1Ni4xOC4xLjE2OTgyMjA1NzAuNDYuMC4w",
      Chats:[],
      onlinestat:"online"
    });
    await updateProfile(user, {
      displayName: fullname,
      phoneNumber: phone     

  })
    
  } catch (err) {
    
    alert(err.message);
  }
  
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
  isLoggedIn = false;
  sessionStorage.clear();
};

const storeAuthToken = ()=>
    {
      auth.currentUser.getIdToken(/* forceRefresh */ true)
        .then(function(idToken) {
            sessionStorage.setItem('token',idToken);
          }).catch(function(error) {
            // Handle error
          });
    }

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  isLoggedIn,
  storage,
};
