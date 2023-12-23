// db.js
import Dexie from 'dexie';

export const inDB = new Dexie('E-Barta');
inDB.version(1).stores({
  userCred: 'uid, p, q, n, d, dp, dq, qInv',
  chatCred: 'chatId, iv, key, frnd_iv, frnd_key',
  chats: 'chatId,msg'

});