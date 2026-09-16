// ============================
// Budget Pro V10 Ultimate
// ============================

const BUDGET = 5000000;

// ---------- Local Storage ----------
let expenses = JSON.parse(localStorage.getItem("budget_expenses") || "[]");

// ---------- Sidebar ----------
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay?.addEventListener("click", closeMenu);

function closeMenu() {
  sidebar?.classList.remove("open");
  overlay?.classList.remove("show");
}

// ---------- เปลี่ยนหน้า ----------
function openPage(pageId) {

  document.querySelectorAll(".page").forEach(p => {
    p.style.display = "none";
  });

  const page = document.getElementById(pageId);
  if (page) page.style.display = "block";

  closeMenu();
}

document.querySelectorAll("[data-page]").forEach(item => {
  item.addEventListener("click", () => {
    openPage(item.dataset.page);
  });
});

// ---------- Popup ----------
const popup = document.getElementById("popup");
const addBtn = document.getElementById("addBtn");
const closePopupBtn = document.getElementById("closePopup");

addBtn?.addEventListener("click", () => popup.classList.add("show"));
closePopupBtn?.addEventListener("click", () => popup.classList.remove("show"));

overlay?.addEventListener("click", () => popup?.classList.remove("show"));

// ---------- บันทึกรายการ ----------
document.getElementById("saveExpense")?.addEventListener("click", () => {

  const name = document.getElementById("expenseName").value.trim();
  const amount = Number(document.getElementById("expenseAmount").value);
  const contractor = document.getElementById("expenseContractor")?.value || "";

  if (!name || amount <= 0) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  expenses.unshift({
    name,
    amount,
    contractor,
    date: new Date().toLocaleDateString("th-TH")
  });

  localStorage.setItem("budget_expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  popup.classList.remove("show");

  renderTable();
  updateCards();
});

// ---------- ตาราง ----------
function renderTable() {

  const tbody = document.getElementById("expenseTable");

  if (!tbody) return;

  tbody.innerHTML = "";

  expenses.forEach((item, index) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.name}</td>
      <td>${item.contractor || "-"}</td>
      <td>${item.amount.toLocaleString()}</td>
      <td>
        <button class="deleteBtn" onclick="removeExpense(${index})">ลบ</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ---------- ลบ ----------
window.removeExpense = function(index) {

  if (!confirm("ลบรายการนี้ใช่หรือไม่?")) return;

  expenses.splice(index, 1);

  localStorage.setItem("budget_expenses", JSON.stringify(expenses));

  renderTable();
  updateCards();
};

// ---------- การ์ด ----------
function updateCards() {

  const used = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remain = BUDGET - used;
  const progress = Math.round((used / BUDGET) * 100);

  const usedCard = document.getElementById("usedCard");
  const remainCard = document.getElementById("remainCard");
  const progressCard = document.getElementById("progressCard");
  const budgetCard = document.getElementById("budgetCard");

  if (budgetCard) budgetCard.textContent = BUDGET.toLocaleString();
  if (usedCard) usedCard.textContent = used.toLocaleString();
  if (remainCard) remainCard.textContent = remain.toLocaleString();
  if (progressCard) progressCard.textContent = progress + "%";
}

// ---------- ค้นหา ----------
document.getElementById("searchExpense")?.addEventListener("input", function(){

  const keyword = this.value.toLowerCase();
  const rows = document.querySelectorAll("#expenseTable tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(keyword)
      ? ""
      : "none";
  });

});

// ---------- Export CSV ----------
window.exportCSV = function(){

  if(expenses.length===0){
    alert("ยังไม่มีข้อมูล");
    return;
  }

  let csv="วันที่,รายการ,ผู้รับเหมา,จำนวนเงิน\n";

  expenses.forEach(e=>{
    csv+=`${e.date},${e.name},${e.contractor},${e.amount}\n`;
  });

  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);

  const a=document.createElement("a");
  a.href=url;
  a.download="BudgetPro.csv";
  a.click();

};

// ---------- เริ่มต้น ----------
document.addEventListener("DOMContentLoaded",()=>{

  renderTable();
  updateCards();

  openPage("homePage");

});
