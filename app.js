
const DB=JSON.parse(localStorage.bpx5||'{"budget":3000000,"cats":["ที่ดิน","ถมที่","เคลียริ่ง","โครงสร้าง","เขื่อน","ถนน","ไฟฟ้า","เครื่องใช้ไฟฟ้า","อุปกรณ์ตกแต่ง","รั้วบ้าน","จัดสวน"],"items":[],"con":[],"due":[]}');
const $=id=>document.getElementById(id);let edit=-1,chart;
document.querySelectorAll('#nav button').forEach((b,i)=>{if(i==0)b.classList.add('active');b.onclick=()=>{document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));$(b.dataset.page).classList.add('active');document.querySelectorAll('#nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}})
function persist(){localStorage.bpx5=JSON.stringify(DB);render()}
open.onclick=()=>{edit=-1;name.value='';amt.value='';modal.classList.remove('hide')}
close.onclick=()=>modal.classList.add('hide')
addCat.onclick=()=>{let c=newCat.value.trim();if(c&&!DB.cats.includes(c)){DB.cats.push(c);newCat.value='';persist()}}
saveExpense.onclick=()=>{if(!name.value||!amt.value)return alert('กรอกข้อมูล');let obj={n:name.value,c:cat.value,a:+amt.value};if(edit>=0)DB.items[edit]=obj;else DB.items.push(obj);modal.classList.add('hide');persist()}
window.editItem=i=>{edit=i;let x=DB.items[i];name.value=x.n;cat.value=x.c;amt.value=x.a;modal.classList.remove('hide')}
window.delItem=i=>{if(confirm('ลบรายการนี้?')){DB.items.splice(i,1);persist()}}
saveCon.onclick=()=>{if(cn.value){DB.con.push({n:cn.value,p:cp.value});cn.value='';cp.value='';persist()}}
saveDue.onclick=()=>{if(due.value){DB.due.push(due.value);due.value='';persist()}}
saveBudget.onclick=()=>{DB.budget=+budgetInput.value||DB.budget;persist()}
backup.onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(DB)],{type:'application/json'}));a.download='BudgetProX-Backup.json';a.click()}
restoreFile.onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{Object.assign(DB,JSON.parse(r.result));persist()};r.readAsText(f)}
search.oninput=render
function render(){
 budgetInput.value=DB.budget;cat.innerHTML=DB.cats.map(c=>`<option>${c}</option>`).join('');
 let sums={};DB.cats.forEach(c=>sums[c]=0);DB.items.forEach(i=>sums[i.c]=(sums[i.c]||0)+i.a);
 let spentVal=DB.items.reduce((a,b)=>a+b.a,0);
 total.textContent=DB.budget.toLocaleString();spent.textContent=spentVal.toLocaleString();remain.textContent=(DB.budget-spentVal).toLocaleString();pct.textContent=Math.round(spentVal/DB.budget*100)+'%';
 budgetList.innerHTML=DB.cats.map(c=>`<div class=row><span>${c}</span><b>${(sums[c]||0).toLocaleString()}</b></div>`).join('');
 let q=(search.value||'').toLowerCase();
 list.innerHTML=DB.items.map((e,i)=>({e,i})).filter(o=>o.e.n.toLowerCase().includes(q)||o.e.c.toLowerCase().includes(q)).map(o=>`<div class=row><div><b>${o.e.n}</b><br>${o.e.c}</div><div><div>${o.e.a.toLocaleString()}</div><button class=small onclick='editItem(${o.i})'>✏️</button><button class=small onclick='delItem(${o.i})'>🗑️</button></div></div>`).join('')||'ยังไม่มีรายการ';
 cons.innerHTML=DB.con.map(c=>`<div class=row><span>${c.n}</span><span>${c.p}</span></div>`).join('')||'ยังไม่มีผู้รับเหมา';
 dues.innerHTML=DB.due.map(d=>`<div class=row><span>ครบกำหนด</span><span>${d}</span></div>`).join('')||'ยังไม่มีงวด';
 if(chart)chart.destroy();chart=new Chart(pie,{type:'pie',data:{labels:DB.cats,datasets:[{data:DB.cats.map(c=>sums[c])}]},options:{plugins:{legend:{position:'bottom'}}}});
}
render()
