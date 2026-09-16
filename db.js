
const DB_NAME='BudgetProX';const STORE='data';
async function openDB(){return await new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function saveState(state){const db=await openDB();const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(state,'state');return tx.done;}
async function loadState(){const db=await openDB();return await new Promise(ok=>{const req=db.transaction(STORE).objectStore(STORE).get('state');req.onsuccess=()=>ok(req.result);req.onerror=()=>ok(null);});}
