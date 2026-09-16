
if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./sw.js').then(reg=>{
   reg.update();
   navigator.serviceWorker.addEventListener('message',e=>{
     if(e.data?.type==='NEW_VERSION'){
       if(confirm('มีเวอร์ชันใหม่ กดตกลงเพื่ออัปเดต')) location.reload();
     }
   });
   setInterval(()=>reg.update(),60000);
 });
}
