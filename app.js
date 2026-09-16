
const B=5000000;let d=JSON.parse(localStorage.getItem('bp10')||'[]');
const fmt=n=>Number(n||0).toLocaleString('th-TH');
function render(){const paid=d.filter(x=>x.s==='จ่ายแล้ว').reduce((a,b)=>a+b.a,0);spent.textContent=fmt(paid);remain.textContent=fmt(B-paid);progress.textContent=Math.round(paid/B*100)+'%';tb.innerHTML=d.map((x,i)=>`<tr><td>${x.i}</td><td>${fmt(x.a)}</td><td>${x.s}</td><td><button onclick='del(${i})'>ลบ</button></td></tr>`).join('');localStorage.setItem('bp10',JSON.stringify(d));}
function add(){if(!item.value||!amt.value)return;d.unshift({i:item.value,a:+amt.value,s:status.value});item.value='';amt.value='';render();}
function del(i){d.splice(i,1);render();}
window.add=add;window.del=del;render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js');
