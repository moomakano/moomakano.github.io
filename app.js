
document.addEventListener('DOMContentLoaded',()=>{
const db=JSON.parse(localStorage.bp7||'{"budget":3000000,"cats":["ที่ดิน","ถมที่","เคลียริ่ง","โครงสร้าง","เขื่อน","ถนน","ไฟฟ้า","เครื่องใช้ไฟฟ้า","อุปกรณ์ตกแต่ง","รั้วบ้าน","จัดสวน"],"items":[],"contractors":[],"payments":[]}');
const $=id=>document.getElementById(id);let chart,edit=-1;
function save(){localStorage.bp7=JSON.stringify(db);render();}
document.querySelectorAll('#nav button').forEach((b,i)=>{if(i===0)b.classList.add('active');b.onclick=()=>{document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));$(b.dataset.page).classList.add('active');document.querySelectorAll('#nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');}});
$('openBtn').onclick=()=>{$('modal').classList.remove('hidden');edit=-1;$('itemName').value='';$('itemAmount').value='';};
$('cancel').onclick=()=>$('modal').classList.add('hidden');
$('addCat').onclick=()=>{const c=$('newCat').value.trim();if(c&&!db.cats.includes(c)){db.cats.push(c);$('newCat').value='';save();}};
$('saveItem').onclick=()=>{const n=$('itemName').value.trim(),a=+$('itemAmount').value,c=$('itemCat').value;if(!n||!a)return alert('กรอกข้อมูลให้ครบ');const o={n,c,a};if(edit>=0)db.items[edit]=o;else db.items.push(o);$('modal').classList.add('hidden');save();};
window.editItem=i=>{edit=i;const x=db.items[i];$('itemName').value=x.n;$('itemCat').value=x.c;$('itemAmount').value=x.a;$('modal').classList.remove('hidden');};
window.delItem=i=>{if(confirm('ลบรายการนี้?')){db.items.splice(i,1);save();}};
$('saveCon').onclick=()=>{if(!$('conName').value.trim())return;db.contractors.push({n:$('conName').value,p:$('conPhone').value});$('conName').value='';$('conPhone').value='';save();};
$('saveDue').onclick=()=>{if(!$('due').value)return;db.payments.push($('due').value);$('due').value='';save();};
$('saveBudget').onclick=()=>{db.budget=+$('budgetInput').value||db.budget;save();};
$('backup').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db)],{type:'application/json'}));a.download='BudgetPro-Backup.json';a.click();};
$('restore').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{Object.assign(db,JSON.parse(r.result));save();};r.readAsText(f);};
$('search').oninput=render;
function render(){
$('budgetInput').value=db.budget;$('itemCat').innerHTML=db.cats.map(c=>`<option>${c}</option>`).join('');
const sums={};db.cats.forEach(c=>sums[c]=0);db.items.forEach(i=>sums[i.c]=(sums[i.c]||0)+i.a);
const spent=db.items.reduce((t,i)=>t+i.a,0);
$('t').textContent=db.budget.toLocaleString();$('s').textContent=spent.toLocaleString();$('r').textContent=(db.budget-spent).toLocaleString();$('pc').textContent=Math.round(spent/db.budget*100)+'%';
$('budgetList').innerHTML=db.cats.map(c=>`<div class=row><span>${c}</span><b>${(sums[c]||0).toLocaleString()}</b></div>`).join('');
const q=($('search').value||'').toLowerCase();
$('expenseList').innerHTML=db.items.map((e,i)=>({e,i})).filter(o=>o.e.n.toLowerCase().includes(q)||o.e.c.toLowerCase().includes(q)).map(o=>`<div class=row><div><b>${o.e.n}</b><br>${o.e.c}</div><div>${o.e.a.toLocaleString()}<br><button class=small onclick='editItem(${o.i})'>✏️</button><button class=small onclick='delItem(${o.i})'>🗑️</button></div></div>`).join('')||'ยังไม่มีรายการ';
$('contractorList').innerHTML=db.contractors.map(c=>`<div class=row><span>${c.n}</span><span>${c.p}</span></div>`).join('')||'ยังไม่มีผู้รับเหมา';
$('dueList').innerHTML=db.payments.map(d=>`<div class=row><span>ครบกำหนด</span><span>${d}</span></div>`).join('')||'ยังไม่มีงวด';
if(chart)chart.destroy();chart=new Chart($('pie'),{type:'pie',data:{labels:db.cats,datasets:[{data:db.cats.map(c=>sums[c])}]},options:{plugins:{legend:{position:'bottom'}}}});
}
render();
});
