
const app=document.getElementById('app');
const BUDGET=5000000;
let data=JSON.parse(localStorage.getItem('bpv13')||'[]');
let page='home';
function save(){localStorage.setItem('bpv13',JSON.stringify(data));}
function cards(){
 const used=data.reduce((s,r)=>s+r.amount,0),left=BUDGET-used,p=Math.round(used/BUDGET*100);
 return `<div class="grid"><div class="card g"><small>งบรวม</small><h2>${BUDGET.toLocaleString()}</h2></div><div class="card b"><small>ใช้ไป</small><h2>${used.toLocaleString()}</h2></div><div class="card y"><small>คงเหลือ</small><h2>${left.toLocaleString()}</h2></div><div class="card p"><small>ความคืบหน้า</small><h2>${p}%</h2></div></div>`;
}
function table(){return `<input id=q placeholder="ค้นหา"><table><tr><th>รายการ</th><th>ผู้รับเหมา</th><th>จำนวน</th><th></th></tr>${data.map((r,i)=>`<tr><td>${r.name}</td><td>${r.contractor||'-'}</td><td>${r.amount.toLocaleString()}</td><td><button class=del data-i=${i}>ลบ</button></td></tr>`).join('')}</table>`}
function render(){
 app.innerHTML=`<div class=top><button id=menu>☰</button><b>🏡 Budget Pro V14</b></div>
 <div id=drawer class=drawer><a data-p=home>🏠 หน้าหลัก</a><a data-p=expenses>💸 รายจ่าย</a><a data-p=contractor>👷 ผู้รับเหมา</a><a data-p=payment>📄 งวดจ่าย</a><a data-p=chart>📊 กราฟ</a><a data-p=export>📤 Export</a><a data-p=settings>⚙️ ตั้งค่า</a></div>
 <div id=overlay class=overlay></div>
 <div class=hero><h1>${page==='home'?'โครงการสร้างบ้าน':page==='expenses'?'รายจ่าย':page==='contractor'?'ผู้รับเหมา':page==='payment'?'งวดจ่าย':page==='chart'?'กราฟ':'เมนู'}</h1></div>
 ${cards()}
 <button id=fab>＋</button>
 <div class=content>${page==='chart'?'<div class=placeholder>กราฟจะเพิ่มในเวอร์ชันถัดไป</div>':page==='export'?'<button id=exp>Export JSON</button>':table()}</div>
 <div id=modal class=modal><div class=box><h3>เพิ่มรายการ</h3><input id=n placeholder="รายการ"><input id=c placeholder="ผู้รับเหมา"><input id=a type=number placeholder="จำนวนเงิน"><div class=actions><button id=cancel>ยกเลิก</button><button id=savebtn>บันทึก</button></div></div></div>`;
 const drawer=document.getElementById('drawer'),ov=document.getElementById('overlay'),modal=document.getElementById('modal');
 document.getElementById('menu').onclick=()=>{drawer.classList.add('show');ov.classList.add('show');}
 ov.onclick=()=>{drawer.classList.remove('show');ov.classList.remove('show');}
 drawer.querySelectorAll('a').forEach(a=>a.onclick=()=>{page=a.dataset.p;drawer.classList.remove('show');ov.classList.remove('show');render();});
 document.getElementById('fab').onclick=()=>modal.classList.add('show');
 document.getElementById('cancel').onclick=()=>modal.classList.remove('show');
 document.getElementById('savebtn').onclick=()=>{const n=nv.value||document.getElementById('n').value;const c=document.getElementById('c').value;const amt=+document.getElementById('a').value;if(!n||!amt)return alert('กรอกข้อมูล');data.unshift({name:n,contractor:c,amount:amt});save();modal.classList.remove('show');render();}
 document.querySelectorAll('.del').forEach(b=>b.onclick=()=>{data.splice(+b.dataset.i,1);save();render();});
 const q=document.getElementById('q'); if(q) q.oninput=e=>{document.querySelectorAll('table tr').forEach((tr,i)=>{if(i===0)return;tr.style.display=tr.innerText.toLowerCase().includes(e.target.value.toLowerCase())?'':'none';});}
 const exp=document.getElementById('exp'); if(exp) exp.onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='budget.json';a.click();}
}
render();
