// ===== Budget Pro V10 =====

// เปิด/ปิด Sidebar
const menuBtn=document.getElementById("menuBtn");
const sidebar=document.getElementById("sidebar");
const overlay=document.getElementById("overlay");

menuBtn?.addEventListener("click",()=>{
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay?.addEventListener("click",closeMenu);

function closeMenu(){
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

// ===== เมนูทั้ง 7 ปุ่ม =====
function openPage(id){
  document.querySelectorAll(".page").forEach(p=>p.style.display="none");
  document.getElementById(id).style.display="block";
  closeMenu();
}

document.querySelectorAll("[data-page]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    openPage(btn.dataset.page);
  });
});

// ===== Popup เพิ่มรายการ =====
const addBtn=document.getElementById("addBtn");
const popup=document.getElementById("popup");
const saveBtn=document.getElementById("saveExpense");
const closeBtn=document.getElementById("closePopup");

addBtn?.addEventListener("click",()=>{
  popup.classList.add("show");
});

closeBtn?.addEventListener("click",()=>{
  popup.classList.remove("show");
});

saveBtn?.addEventListener("click",saveExpense);

let expenses=JSON.parse(localStorage.getItem("expenses")||"[]");

function saveExpense(){

  const name=document.getElementById("expenseName").value.trim();
  const amount=Number(document.getElementById("expenseAmount").value);
  const contractor=document.getElementById("expenseContractor").value;

  if(!name||!amount){
    alert("กรอกข้อมูลให้ครบ");
    return;
  }

  expenses.unshift({
    name,
    amount,
    contractor,
    date:new Date().toLocaleDateString("th-TH")
  });

  localStorage.setItem("expenses",JSON.stringify(expenses));

  popup.classList.remove("show");

  document.getElementById("expenseName").value="";
  document.getElementById("expenseAmount").value="";

  renderTable();
  updateCards();
}

// ===== ตาราง =====
function renderTable(){

  const tbody=document.getElementById("expenseTable");
  if(!tbody)return;

  tbody.innerHTML="";

  expenses.forEach((e,i)=>{

    tbody.innerHTML+=`
    <tr>
      <td>${e.date}</td>
      <td>${e.name}</td>
      <td>${e.contractor||"-"}</td>
      <td>${e.amount.toLocaleString()}</td>
      <td><button onclick="removeExpense(${i})">ลบ</button></td>
    </tr>`;
  });
}

window.removeExpense=function(i){
  expenses.splice(i,1);
  localStorage.setItem("expenses",JSON.stringify(expenses));
  renderTable();
  updateCards();
}

// ===== การ์ดสรุป =====
const budget=5000000;

function updateCards(){

  const used=expenses.reduce((a,b)=>a+b.amount,0);

  document.getElementById("usedCard").textContent=used.toLocaleString();
  document.getElementById("remainCard").textContent=(budget-used).toLocaleString();
  document.getElementById("progressCard").textContent=Math.round(used/budget*100)+"%";
}

// เริ่มต้น
renderTable();
updateCards();
openPage("homePage");
