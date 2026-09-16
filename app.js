
const db=JSON.parse(localStorage.getItem('budgetPro61')||'{"budget":3000000,"cats":["ที่ดิน","ถมที่","เคลียริ่ง","โครงสร้าง","เขื่อน","ถนน","ไฟฟ้า","เครื่องใช้ไฟฟ้า","อุปกรณ์ตกแต่ง","รั้วบ้าน","จัดสวน"],"items":[],"contractors":[],"payments":[]}');
const $=id=>document.getElementById(id);let chart,editing=-1;

function saveDB(){localStorage.setItem('budgetPro61',JSON.stringify(db));render();}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('#bottomNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));}
document.querySelectorAll('#bottomNav button').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
showPage('home');

$('openBtn').onclick=()=>{$('modal').classList.remove('hidden');editing=-1;$('itemName').value='';$('itemAmount').value='';};
$('cancelBtn').onclick=()=>$('modal').classList.add('hidden');
$('addCatBtn').onclick=()=>{const c=$('newCat').value.trim();if(c&&!db.cats.includes(c)){db.cats.push(c);$('newCat').value='';saveDB();}};
$('saveItemBtn').onclick=()=>{const n=$('itemName').value.trim(),c=$('itemCat').value,a=Number($('itemAmount').value);if(!n||!a){alert('กรอกข้อมูลให้ครบ');return;}const obj={n,c,a};if(editing>=0)db.items[editing]=obj;else db.items.push(obj);$('modal').classList.add('hidden');saveDB();};
$('saveConBtn').onclick=()=>{const n=$('conName').value.trim();if(!n)return;db.contractors.push({n,p:$('conPhone').value});$('conName').value='';$('conPhone').value='';saveDB();};
$('saveDueBtn').onclick=()=>{if(!$('dueDate').value)return;db.payments.push($('dueDate').value);$('dueDate').value='';saveDB();};
$('saveBudgetBtn').onclick=()=>{db.budget=Number($('budgetInput').value)||db.budget;saveDB();};
$('searchBox').oninput=render;

window.editItem=i=>{editing=i;const x=db.items[i];$('itemName').value=x.n;$('itemCat').value=x.c;$('itemAmount').value=x.a;$('modal').classList.remove('hidden');};
window.delItem=i=>{db.items.splice(i,1);saveDB();};

function render(){
 $('budgetInput').value=db.budget;
 $('itemCat').innerHTML=db.cats.map(c=>`<option>${c}</option>`).join('');
 const sums={};db.cats.forEach(c=>sums[c]=0);db.items.forEach(i=>sums[i.c]+=i.a);
 const spent=db.items.reduce((t,i)=>t+i.a,0);
 $('total').textContent=db.budget.toLocaleString();
 $('spent').textContent=spent.toLocaleString();
 $('remain').textContent=(db.budget-spent).toLocaleString();
 $('percent').textContent=Math.round(spent/db.budget*100)+'%';
 $('budgetList').innerHTML=db.cats.map(c=>`<div class="row"><span>${c}</span><b>${(sums[c]||0).toLocaleString()}</b></div>`).join('');
 const q=($('searchBox').value||'').toLowerCase();
 $('expenseList').innerHTML=db.items.map((e,i)=>({e,i})).filter(o=>o.e.n.toLowerCase().includes(q)||o.e.c.toLowerCase().includes(q)).map(o=>`<div class="row"><div><b>${o.e.n}</b><br>${o.e.c}</div><div>${o.e.a.toLocaleString()}<br><button class="small" onclick="editItem(${o.i})">✏️</button><button class="small" onclick="delItem(${o.i})">🗑️</button></div></div>`).join('')||'ยังไม่มีรายการ';
 $('contractorList').innerHTML=db.contractors.map(c=>`<div class="row"><span>${c.n}</span><span>${c.p}</span></div>`).join('')||'ยังไม่มีผู้รับเหมา';
 $('dueList').innerHTML=db.payments.map(d=>`<div class="row"><span>ครบกำหนด</span><span>${d}</span></div>`).join('')||'ยังไม่มีงวด';
 if(chart)chart.destroy();
 chart=new Chart($('pieChart'),{type:'pie',data:{labels:db.cats,datasets:[{data:db.cats.map(c=>sums[c])}]},options:{plugins:{legend:{position:'bottom'}}}});
}
render();
