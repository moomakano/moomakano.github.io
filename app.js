document.addEventListener("DOMContentLoaded", () => {

  // ===== Sidebar =====
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  menuBtn?.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  });

  overlay?.addEventListener("click", closeMenu);

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  }

  // ===== Popup =====
  const addBtn = document.getElementById("addBtn");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");

  addBtn?.addEventListener("click", () => popup.classList.add("show"));
  closePopup?.addEventListener("click", () => popup.classList.remove("show"));

  // ===== เมนูทั้ง 7 =====
  const sections = {
    home: document.getElementById("home"),
    expense: document.getElementById("expense"),
    contractor: document.getElementById("contractor"),
    payment: document.getElementById("payment"),
    chart: document.getElementById("chart"),
    export: document.getElementById("export"),
    settings: document.getElementById("settings")
  };

  function show(name){
    Object.values(sections).forEach(s=>{
      if(s) s.style.display="none";
    });
    if(sections[name]) sections[name].style.display="block";
    closeMenu();
  }

  document.getElementById("navHome")?.addEventListener("click",()=>show("home"));
  document.getElementById("navExpense")?.addEventListener("click",()=>show("expense"));
  document.getElementById("navContractor")?.addEventListener("click",()=>show("contractor"));
  document.getElementById("navPayment")?.addEventListener("click",()=>show("payment"));
  document.getElementById("navChart")?.addEventListener("click",()=>show("chart"));
  document.getElementById("navExport")?.addEventListener("click",()=>show("export"));
  document.getElementById("navSettings")?.addEventListener("click",()=>show("settings"));

  // ===== Local Storage =====
  let items = JSON.parse(localStorage.getItem("budgetItems") || "[]");

  const list = document.getElementById("expenseTable");
  const totalEl = document.getElementById("spent");
  const remainEl = document.getElementById("remain");
  const budget = 5000000;

  function render(){
    if(!list) return;

    list.innerHTML="";

    let spent=0;

    items.forEach((i,index)=>{
      spent+=Number(i.amount);

      const tr=document.createElement("tr");
      tr.innerHTML=`
      <td>${i.name}</td>
      <td>${Number(i.amount).toLocaleString()}</td>
      <td><button onclick="deleteItem(${index})">🗑️</button></td>`;
      list.appendChild(tr);
    });

    totalEl.textContent=spent.toLocaleString();
    remainEl.textContent=(budget-spent).toLocaleString();
  }

  window.deleteItem=function(index){
    items.splice(index,1);
    localStorage.setItem("budgetItems",JSON.stringify(items));
    render();
  }

  document.getElementById("saveItem")?.addEventListener("click",()=>{
    const name=document.getElementById("itemName").value.trim();
    const amount=document.getElementById("itemAmount").value;

    if(!name||!amount){
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    items.push({name,amount});
    localStorage.setItem("budgetItems",JSON.stringify(items));

    document.getElementById("itemName").value="";
    document.getElementById("itemAmount").value="";
    popup.classList.remove("show");

    render();
  });

  render();
});
