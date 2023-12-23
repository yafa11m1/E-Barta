import forge from 'node-forge';
import { inDB } from './inDB';

// Generate RSA key pair with 512-bit prime
const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

// Function to convert RSA key to integer format
const keyToInteger = (key) => {
  const keyDer = forge.asn1.toDer(forge.pki[key + 'KeyToAsn1'](keyPair[key])).getBytes();
  return forge.util.createBuffer(keyDer).toHex();
};

// Function to encrypt using RSA public key (integer format)
export const encryptWithPublicKeyInteger = (plaintext, pubKey) => {
  const key = new forge.jsbn.BigInteger(pubKey,16)
  const E = new forge.jsbn.BigInteger('10001',16)

  const publicKeyInstance = forge.pki.rsa.setPublicKey(
    key,
    E
  );
  // console.log(publicKeyInstance)
  const encrypted = publicKeyInstance.encrypt(forge.util.encodeUtf8(plaintext), 'RSA-OAEP');

  return forge.util.encode64(encrypted);
};

// Function to decrypt using RSA private key (integer format)
export const decryptWithPrivateKeyInteger = async (ciphertext,userUid) => {
  const rsakey = await inDB.userCred.where("uid").equals(userUid).first()
  console.log(rsakey)
  const privateKeyInstance = forge.pki.setRsaPrivateKey(
    new forge.jsbn.BigInteger(rsakey.n,16),
    new forge.jsbn.BigInteger('10001', 16),
    new forge.jsbn.BigInteger(rsakey.d, 16),
    new forge.jsbn.BigInteger(rsakey.p, 16),
    new forge.jsbn.BigInteger(rsakey.q, 16),
    new forge.jsbn.BigInteger(rsakey.dp, 16),
    new forge.jsbn.BigInteger(rsakey.dq, 16),
    new forge.jsbn.BigInteger(rsakey.qInv, 16),

  );

  const decrypted = privateKeyInstance.decrypt(
    forge.util.decode64(ciphertext),
    'RSA-OAEP'
  );

  return forge.util.decodeUtf8(decrypted);
};

export const generateRandomValue = () => {
  // Generate a random 16-byte value
  const bytes = forge.random.getBytesSync(16);
  // Convert it to a hex string
  return forge.util.bytesToHex(bytes);
};
// Function to get the public key in integer format
export const getKeyInteger = (ID) => {
    // Generate RSA key pair with 512-bit prime
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 1024 });
    console.log(keyPair)

   // Convert public key to integer
  const publicKey = keyPair.publicKey.n.toString(16)

  // Convert private key to integer
  const privateKey = keyPair.privateKey.d.toString(16)
  const p = keyPair.privateKey.p.toString(16)
  const q = keyPair.privateKey.q.toString(16)
  const dQ = keyPair.privateKey.dQ.toString(16)
  const dp = keyPair.privateKey.dP.toString(16)
  const Qinv =  keyPair.privateKey.qInv.toString(16)
  sessionStorage.setItem("p",p);
  sessionStorage.setItem("q",q);
  sessionStorage.setItem("dQ",dQ);
  sessionStorage.setItem("dP",dp);
  sessionStorage.setItem("qInv",Qinv);

  inDB.userCred.add({
    uid:ID,
    p:p,
    q:q,
    d:privateKey,
    n:publicKey,
    qInv:Qinv,
    dp:dp,
    dq:dQ

  })






    console.log(publicKey, privateKey)
  return {pub:publicKey,priv:privateKey};
};

// Function to get the private key in integer format
export const getPrivateKeyInteger = () => {
  return keyToInteger('private');
};
