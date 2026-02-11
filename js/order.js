// =====================================
// order.js (Vanilla JS)
// - Reads cart from localStorage
// - Renders order rows + total
// - Quantity controller (+ / -)
// - Empty cart & Order Now popups (modal)
// =====================================

const CART_KEY = "la_tavola_cart";
document.addEventListener("DOMContentLoaded", () => {
  const modalBackdrop = document.getElementById("modalBackdrop");
  if (modalBackdrop) modalBackdrop.hidden = true;
});
// نفس بيانات items.js (عشان نعرف اسم/صورة/سعر كل id)
const MENU = {
  pizza: [
    { id: "pz1", name: "Margherita", price: 9.99, img: "images/margherita.jpg" },
    { id: "pz2", name: "Pepperoni", price: 11.50, img: "images/Pepperoni.jpg" },
    { id: "pz3", name: "Veggie", price: 10.75, img: "images/veggie.jpg" }
  ],
  burgers: [
    { id: "bg1", name: "Classic Burger", price: 8.99, img: "images/basic-burger.jpg" },
    { id: "bg2", name: "Cheese Burger", price: 9.75, img: "images/Cheeseburger.jpg" },
    { id: "bg3", name: "Chicken Burger", price: 9.25, img: "images/Chicken-Burger.jpg" }
  ],
  pasta: [
    { id: "ps1", name: "Penne Arrabiata", price: 12.00, img: "images/Penne .jpg" },
    { id: "ps2", name: "Alfredo", price: 12.75, img: "images/Alfredo.jpg" },
    { id: "ps3", name: "Bolognese", price: 13.50, img: "images/Bolognese.jpg" }
  ],
  salads: [
    { id: "sl1", name: "Greek Salad", price: 7.25, img: "images/Greek Salad.jpg" },
    { id: "sl2", name: "Caesar Salad", price: 7.99, img: "images/Caesar Salad.jpg" },
    { id: "sl3", name: "Garden Salad", price: 6.75, img: "images/Garden-Salad.jpg" }
  ],
  drinks: [
    { id: "dr1", name: "Fresh Lemonade", price: 3.50, img: "images/fresh-lemonade.jpg" },
    { id: "dr2", name: "Iced Tea", price: 3.25, img: "images/sweet-tea.jpg" },
    { id: "dr3", name: "Mocktail", price: 4.75, img: "images/mocktail.jpg" }
  ],
  desserts: [
    { id: "ds1", name: "Chocolate Cake", price: 5.50, img: "images/Chocolate-Cake.jpg" },
    { id: "ds2", name: "Cheesecake", price: 5.75, img: "images/cheesecake.jpg" },
    { id: "ds3", name: "Brownie", price: 4.99, img: "images/brownie.jpg" }
  ]
};

// -------- Helpers --------
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch { return {}; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function totalQty(cart) {
  return Object.values(cart).reduce((sum, n) => sum + n, 0);
}

function flattenMenu() {
  const all = {};
  Object.values(MENU).flat().forEach(item => { all[item.id] = item; });
  return all;
}

const ITEMS_BY_ID = flattenMenu();

// -------- Badge --------
function setBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  badge.textContent = totalQty(readCart());
}

// -------- Modal --------
const backdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalActions = document.getElementById("modalActions");

function openModal(title, message, actions) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modalActions.innerHTML = "";
  actions.forEach(a => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = a.className;
    btn.textContent = a.text;
    btn.addEventListener("click", a.onClick);
    modalActions.appendChild(btn);
  });

  backdrop.hidden = false;
}

function closeModal() {
  backdrop.hidden = true;
}

if (backdrop) {
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
}

// -------- Render Order --------
const orderList = document.getElementById("orderList");
const emptyState = document.getElementById("emptyState");
const totalEl = document.getElementById("totalPrice");
const summary = document.getElementById("orderSummary"); 
function calcTotal(cart) {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const item = ITEMS_BY_ID[id];
    if (item) total += item.price * qty;
  }
  return total;
}

function render() {
  const cart = readCart();
  setBadge();

  const ids = Object.keys(cart);

  // ✅ Empty state
  if (!ids.length) {
    emptyState.hidden = false;
    orderList.innerHTML = "";
    totalEl.textContent = "$0.00";
    if (summary) summary.style.display = "none"; // ✅ NEW
    return;
  }

  // ✅ Has items
  emptyState.hidden = true;
  if (summary) summary.style.display = "flex";   // ✅ NEW

  orderList.innerHTML = ids.map(id => {
    const item = ITEMS_BY_ID[id];
    const qty = cart[id];

    if (!item) return "";

    return `
      <div class="order-row" data-id="${id}">
        <img class="order-img" src="${item.img}" alt="${item.name}">
        <div class="order-info">
          <div class="order-name">${item.name}</div>
          <div class="order-price">$${item.price.toFixed(2)}</div>
        </div>

        <div class="order-qty">
          <button class="qty-btn" data-action="minus">-</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" data-action="plus">+</button>
        </div>
      </div>
    `;
  }).join("");

  totalEl.textContent = "$" + calcTotal(cart).toFixed(2);
}

render();

// -------- Qty buttons --------
orderList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const row = e.target.closest(".order-row");
  if (!row) return;

  const id = row.dataset.id;
  const action = btn.dataset.action;

  const cart = readCart();
  const current = cart[id] || 0;

  if (action === "plus") {
    cart[id] = current + 1;
  } else if (action === "minus") {
    const next = current - 1;
    if (next <= 0) delete cart[id];
    else cart[id] = next;
  }

  saveCart(cart);
  render();
});

// -------- Buttons: Order Now / Empty --------
const orderNowBtn = document.getElementById("orderNowBtn");
const emptyBtn = document.getElementById("emptyBtn");

orderNowBtn.addEventListener("click", () => {
  const cart = readCart();
  if (!Object.keys(cart).length) {
    openModal("Info", "No items to order.", [
      { text: "OK", className: "btn-primary", onClick: closeModal }
    ]);
    return;
  }

  openModal("Success ✅", "Your order has been placed successfully!", [
    {
      text: "OK",
      className: "btn-primary",
      onClick: () => {
        localStorage.removeItem(CART_KEY);
        closeModal();
        render();
      }
    }
  ]);
});

emptyBtn.addEventListener("click", () => {
  const cart = readCart();
  if (!Object.keys(cart).length) {
    openModal("Info", "Your cart is already empty.", [
      { text: "OK", className: "btn-primary", onClick: closeModal }
    ]);
    return;
  }

  openModal("Warning ⚠️", "This action will clear all order items. Are you sure?", [
    {
      text: "Accept",
      className: "btn-danger",
      onClick: () => {
        localStorage.removeItem(CART_KEY);
        closeModal();
        render();
      }
    },
    { text: "Cancel", className: "btn-secondary", onClick: closeModal }
  ]);
});