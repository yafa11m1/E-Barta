import { db } from "./firebase";
import { v4 as uuid } from "uuid";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    arrayUnion,
    Timestamp,
  } from "firebase/firestore";
import { inDB } from "./inDB";
import { decryptWithPrivateKeyInteger, encryptWithPublicKeyInteger, generateRandomValue } from "./rsa";


const addUserInfotoCloudDB = async(uid, photourl, username, email,gender,phone, fullname)=>{
    try{
        const data = {
            Uid:uid,
            Username:username,
            Fullname:fullname,
            Email:email,
            Gender:gender,
            Phone:phone,
            PhotoUrl:photourl,
            Friends:{},
            onlinestat:"online"       

        }
        await setDoc(doc(db, "users", uid), data);

    }
    catch(err){
        console.log(err);
    }
}



const ChatList = async (uid)=> {
    try{
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        // console.log(userData);
        return userData.Chats;
    }
    catch(err){
        console.log(err);
        
    }

}

const userInfo = async (uid) => {
    try{
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        // console.log(userData);
        return {
            Fullname: userData.Fullname,
            Uid: userData.Uid,
            PhotoUrl: userData.PhotoUrl,
            Email: userData.Email,
            Gender: userData.Gender,
            Phone:userData.Phone

        }

    }
    catch(err){
        console.log(err);
        
    }
}

const GetRSAKey = async (uid) => {
    try{
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        // console.log(userData);
        return userData.RSAkey;

    }
    catch(err){
        console.log(err);
        
    }
}

const updateInfoarray = async (uid,name,gender,phone, photourl) => {
    try{
        const userDocRef = doc(db, 'users', uid);
        console.log("update call ",[uid,name,gender,phone, photourl]);
        await updateDoc(userDocRef, {
            Fullname: name,
            PhotoUrl:photourl,
            Gender:gender,
            Phone:phone

          });
        return "ProfileDB updated"

    }
    catch(err){
        console.log(err);
        
        
    }
}

const updateInfoRSA = async (uid) => {
    try{
        const userDocRef = doc(db, 'users', uid);
        // console.log("update call ",[uid,name,gender,phone, photourl]);
        const rsakey = await inDB.userCred.where("uid").equals(uid).first()
        // console.log(rsakey, rsakey.n)
        await updateDoc(userDocRef, {
            RSAkey:rsakey.n

          });
        return "RSA key updated"

    }
    catch(err){
        console.log(err);
        
        
    }
}
const getAllUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
  
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, Fullname:doc.data().Fullname, Email:doc.data().Email, PhotoUrl: doc.data().PhotoUrl  });
    });
    
    return users;
  };
const SendTxt = async (ChatId,text,uid)=>{
    console.log(ChatId,text,uid)
    try{
        console.log(ChatId);
        const chatDocRef =doc(db, "chats", ChatId);
        const res = await getDoc(chatDocRef);
        // console.log(res);
        await updateDoc(chatDocRef, {
            messages: arrayUnion({
              Id: uuid(),
              Text:text,
              SenderId: uid,
              Date: Timestamp.now(),
            }),
            LastMsg:{
                Id: uuid(),
                Text:text,
                SenderId: uid,
                Date: Timestamp.now(),
            }
        });
        await updateChatsArray (uid,ChatId.replace(uid,""), ChatId);
        return true;
    }
    catch (err){
        console.log(err)
        return false;
    }
   
}

const updateChatsArray = async (sender, receiver, chatid) => {
  
    try {
      // Get the current array from the document
      const userDocRef = doc(db, 'users', sender);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const currentChats = userData.Chats || [];
  
      // Remove the value from the array if it exists
      const filteredChats = currentChats.filter((chat) => chat !== chatid);
  
      // Add the value to the beginning of the array
      const updatedChats = [chatid, ...filteredChats];
  
      // Update the document with the new array
      await updateDoc(userDocRef,{
        Chats: updatedChats,
      });

      const user2DocRef = doc(db, 'users', receiver);
      const user2DocSnapshot = await getDoc(user2DocRef);
      const user2Data = user2DocSnapshot.data();
      const currentChats2 = user2Data.Chats || [];
  
      // Remove the value from the array if it exists
      const filteredChats2 = currentChats2.filter((chat) => chat !== chatid);
  
      // Add the value to the beginning of the array
      const updatedChats2 = [chatid, ...filteredChats2];
  
      // Update the document with the new array
      await updateDoc(user2DocRef,{
        Chats: updatedChats2,
      });
  
      console.log("updated",sender, receiver, chatid)
    } catch (error) {
      console.error('Error updating Chats array:', error);
    }
  };
  export const exchangeKey = async (userUid,FriendUid)=> {
        
    // const keys = JSON.parse(sessionStorage.getItem(chatId));
    const chatId = userUid > FriendUid ? userUid + FriendUid : FriendUid + userUid

    const keys2 = await inDB.chatCred.where("chatId").equals(chatId).first();
    // console.log(keys2)
    if(keys2&&keys2.iv!=''){

        // console.log(keys);
        const secret = keys2.iv+":"+keys2.key;
        console.log(secret);
        GetRSApubKey(chatId,FriendUid).then((Frndkey)=>{
        // Updating Encrypted Keys
        const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
        updatePubkey(chatId,userUid,encSecret);
        if(Frndkey.AES!=''){
            decryptWithPrivateKeyInteger(Frndkey.AES,userUid).then((frndAESKey)=>{
                const [FiV, Fkey] = frndAESKey.split(":");
                console.log(frndAESKey)

                const updatedkeys = {
                    ...keys2,
                    frnd_iv:FiV,
                    frnd_key:Fkey
                }
                // sessionStorage.setItem(chatId,JSON.stringify(updatedkeys));
                // console.log(updatedkeys)
                inDB.chatCred.put(updatedkeys)

            })
        }
        // console.log("friend: ",Frndkey)
      
        
        
        
    });
    }
    else{

        const IV = generateRandomValue();
        const KEY = generateRandomValue();
        GetRSApubKey(chatId,FriendUid).then((Frndkey)=>{
            // Updating Encrypted Keys
            const secret = IV+":"+KEY;
            GetRSApubKey(chatId,FriendUid).then((Frndkey)=>{
                // Updating Encrypted Keys
                const encSecret = encryptWithPublicKeyInteger(secret,Frndkey.RSA); // ecncrypted IV and Key with Friends RSA Pub key
                
                updatePubkey(chatId,userUid,encSecret);
            })
            if(Frndkey.AES!=''){
                decryptWithPrivateKeyInteger(Frndkey.AES,userUid).then((frndAESKey)=>{
                    const [FiV, Fkey] = frndAESKey.split(":");
                    console.log(frndAESKey)
    
                    const updatedkeys = {
                        chatId:chatId,
                        iv:IV,
                        key:KEY,
                        frnd_iv:FiV,
                        frnd_key:Fkey
                    }
                    // sessionStorage.setItem(chatId,JSON.stringify(updatedkeys));
                    console.log(updatedkeys)
                    inDB.chatCred.add(updatedkeys)
    
                })
            }
            else{
                inDB.chatCred.add({
                    chatId:chatId,
                    iv:IV,
                    key:KEY,
                    frnd_iv:'',
                    frnd_key:''
        
                })

            }
            // console.log("friend: ",Frndkey)
          
            
            
            
        });
       
        
    }
}
  const addChat = async(userUid,FriendUid)=>{
    // console.log(userUid,FriendUid);
    const rsa = await GetRSAKey(FriendUid);
    const chatId = userUid > FriendUid ? userUid + FriendUid : FriendUid + userUid
    
    try{
        const chatdocRef = doc(db,'chats',userUid>FriendUid?userUid+FriendUid:FriendUid+userUid);
        const chatdata = await getDoc(chatdocRef);
        const rsakey = await inDB.userCred.where("uid").equals(userUid).first()

        !chatdata.exists()? await setDoc(chatdocRef,{
            messages:[],
            Keys:{
                RSA:{
                    [userUid]:rsakey.n||"",
                    [FriendUid]:rsa
                },
                AES:{
                    [userUid]:"",
                    [FriendUid]:""
                }
            }
          }):"";
          
         await exchangeKey(userUid,FriendUid);
    }
    catch(err){
        console.log(err);
        
    }
}

const GetRSApubKey = async(chatId,FriendUid)=>{
    console.log(chatId,FriendUid)
    try{
        const chatdocRef = doc(db,'chats',chatId);
        const chatdata = await getDoc(chatdocRef);
        const data = chatdata.data();
        const aes = data.Keys.AES;
        const rsa = await GetRSAKey(FriendUid);
        return {RSA:rsa,AES:aes[FriendUid]};
        
        
    }
    catch(err){
        console.log(err);
        
    }
}

const updatePubkey = async(chatId,userUid,secret)=>{
    console.log(chatId,userUid,secret)
    try{
        const chatdocRef = doc(db,'chats',chatId);
        const chatdata = await getDoc(chatdocRef);
        const rsakey = await inDB.userCred.where("uid").equals(userUid).first()

        if (chatdata.exists) {
            const existingData = chatdata.data();
            const updatedData = {
              ...existingData,
              Keys: {
                ...existingData.Keys,
                AES: {
                  ...existingData.Keys.AES,
                  [userUid]: secret,
                },
                RSA: {
                    ...existingData.Keys.RSA,
                    [userUid]: rsakey.n,
                  },
              },
            };
      
            // Update the document
        await updateDoc(chatdocRef,updatedData);
        }
        
    }
    catch(err){
        console.log(err);
        
    }
}
const updateRSAkey = async(chatId,userUid)=>{
    try{
        const chatdocRef = doc(db,'chats',chatId);
        const chatdata = await getDoc(chatdocRef);
        const rsakey = await inDB.userCred.where("uid").equals(userUid).first()
        if (chatdata.exists) {
            const existingData = chatdata.data();
            const updatedData = {
              ...existingData,
              Keys: {
                ...existingData.Keys,
                RSA: {
                    ...existingData.Keys.RSA,
                    [userUid]: rsakey.n,
                  },
              },
            };
      
            // Update the document
        await updateDoc(chatdocRef,updatedData);
        }
        
    }
    catch(err){
        console.log(err);
        
    }
}

const GetLastMsg = async (ChatId)=>{
    // console.log(ChatId)
    try{
        // console.log(ChatId);
        const chatDocRef =doc(db, "chats", ChatId);
        const res = await getDoc(chatDocRef);
        const data = res.data();
        // console.log(data.LastMsg);
        
        return data.LastMsg;
    }
    catch (err){
        console.log(err)
        return {
            Id: 'Error',
            Text:'Error ',
            SenderId: 'Error ',
            Date: 'Error ',
        };
    }
   
}


export {
 addUserInfotoCloudDB,
 addChat,
 ChatList,
 userInfo,
 updateInfoarray,
 SendTxt,
 updateChatsArray,
 GetLastMsg,
 GetRSApubKey,
 updatePubkey,
 updateRSAkey,
 updateInfoRSA,
 getAllUsers,
};