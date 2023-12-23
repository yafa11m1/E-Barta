import forge from 'node-forge';

export const encryptAES = (text, key, iv) => {
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(key));
    cipher.start({ iv: forge.util.hexToBytes(iv) });
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    console.log(text, key, iv)
    return cipher.output.toHex();
  };

export const decryptAES = (ciphertext, key, iv) => {
  try{
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(key));
    decipher.start({ iv: forge.util.hexToBytes(iv) });
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(ciphertext)));
    decipher.finish();
    console.log(decipher)
    return decipher.output.toString('utf-8');
  }
  catch(err){
    return "Faild to decrypt Please! Refresh"
  }
    
};