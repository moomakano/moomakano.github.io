
const db=JSON.parse(localStorage.bpx2||'{"cats":["ที่ดิน","ถมที่","เคลียริ่ง","โครงสร้าง","เขื่อน","ถนน","ไฟฟ้า","เครื่องใช้ไฟฟ้า","อุปกรณ์ตกแต่ง","รั้วบ้าน","จัดสวน"],"exp":[]}');
const $=i=>document.getElementById(i);let chart;
function save(){localStorage.bpx2=JSON.stringify(db);draw();}
$('cat').innerHTML=db.cats.map(c=>`<option>${c}</option>`).join('');
$('open').onclick=()=>$('modal').classList.remove('hide');$('close').onclick=()=>$('modal').classList.add('hide');
$('save').onclick=()=>{if(!$('n').value||!$('a').value)return alert('กรอกข้อมูล');db.exp.push({n:$('n').value,c:$('cat').value,a:+$('a').value});$('modal').classList.add('hide');$('n').value='';$('a').value='';save();}
function draw(){let sums={};db.cats.forEach(c=>sums[c]=0);db.exp.forEach(e=>sums[e.c]+=e.a);let spent=db.exp.reduce((a,b)=>a+b.a,0);$('s').textContent=spent.toLocaleString();$('r').textContent=(3000000-spent).toLocaleString();$('pc').textContent=Math.round(spent/3000000*100)+'%';if(chart)chart.destroy();chart=new Chart(pie,{type:'pie',data:{labels:db.cats,datasets:[{data:db.cats.map(c=>sums[c])}]}});}
draw();
