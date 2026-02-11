// =====================================
// items.js (Vanilla JS)
// - Reads selected category from URL (?cat=...)
// - Renders items as cards
// - Add button -> quantity controller (+ / -)
// - Cart badge updates dynamically
// - Uses localStorage to keep order data
// =====================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- Data ----------
  const MENU = {
    pizza: [
      { id: "pz1", name: "Margherita", desc: "Classic tomato, mozzarella, basil.", price: 9.99, img: "images/margherita.jpg", details: "Ingredients: tomato sauce, mozzarella, basil, olive oil." },
      { id: "pz2", name: "Pepperoni", desc: "Mozzarella, pepperoni, oregano.", price: 11.50, img: "images/Pepperoni.jpg", details: "Ingredients: mozzarella, pepperoni, oregano, tomato sauce." },
      { id: "pz3", name: "Veggie", desc: "Loaded vegetables and cheese.", price: 10.75, img: "images/veggie.jpg", details: "Ingredients: peppers, olives, onion, mushrooms, mozzarella." }
    ],
    burgers: [
      { id: "bg1", name: "Classic Burger", desc: "Beef patty with lettuce & tomato.", price: 8.99, img: "images/basic-burger.jpg", details: "Ingredients: beef, lettuce, tomato, onion, house sauce." },
      { id: "bg2", name: "Cheese Burger", desc: "Melted cheese, juicy beef.", price: 9.75, img: "images/Cheeseburger.jpg", details: "Ingredients: beef, cheddar, pickles, onion, ketchup." },
      { id: "bg3", name: "Chicken Burger", desc: "Crispy chicken, mayo, lettuce.", price: 9.25, img: "images/Chicken-Burger.jpg", details: "Ingredients: chicken, lettuce, mayo, pickles." }
    ],
    pasta: [
      { id: "ps1", name: "Penne Arrabiata", desc: "Spicy tomato sauce & herbs.", price: 12.00, img: "images/Penne .jpg", details: "Ingredients: penne, tomato, chili, garlic, herbs." },
      { id: "ps2", name: "Alfredo", desc: "Creamy sauce, parmesan.", price: 12.75, img: "images/Alfredo.jpg", details: "Ingredients: pasta, cream, parmesan, butter." },
      { id: "ps3", name: "Bolognese", desc: "Rich meat sauce, parmesan.", price: 13.50, img: "images/Bolognese.jpg", details: "Ingredients: beef, tomato, onion, garlic, parmesan." }
    ],
    salads: [
      { id: "sl1", name: "Greek Salad", desc: "Fresh veggies, feta, olives.", price: 7.25, img: "images/Greek Salad.jpg", details: "Ingredients: cucumber, tomato, olives, feta, oregano." },
      { id: "sl2", name: "Caesar Salad", desc: "Romaine, croutons, parmesan.", price: 7.99, img: "images/Caesar Salad.jpg", details: "Ingredients: romaine, croutons, parmesan, caesar dressing." },
      { id: "sl3", name: "Garden Salad", desc: "Mixed greens & vegetables.", price: 6.75, img: "images/Garden-Salad.jpg", details: "Ingredients: mixed greens, tomato, carrot, cucumber." }
    ],
    drinks: [
      { id: "dr1", name: "Fresh Lemonade", desc: "Refreshing & cold.", price: 3.50, img: "images/fresh-lemonade.jpg", details: "Details: fresh lemon, ice, mint (optional)." },
      { id: "dr2", name: "Iced Tea", desc: "Classic chilled tea.", price: 3.25, img: "images/sweet-tea.jpg", details: "Details: black tea, ice, lemon slice." },
      { id: "dr3", name: "Mocktail", desc: "Fruity mix, no alcohol.", price: 4.75, img: "images/mocktail.jpg", details: "Details: fruit mix, soda, ice." }
    ],
    desserts: [
      { id: "ds1", name: "Chocolate Cake", desc: "Rich chocolate & cream.", price: 5.50, img: "images/Chocolate-Cake.jpg", details: "Ingredients: cocoa, chocolate, cream, sugar." },
      { id: "ds2", name: "Cheesecake", desc: "Creamy cheese & biscuit base.", price: 5.75, img: "images/cheesecake.jpg", details: "Ingredients: cream cheese, biscuit base, vanilla." },
      { id: "ds3", name: "Brownie", desc: "Warm brownie, soft inside.", price: 4.99, img: "images/brownie.jpg", details: "Ingredients: cocoa, butter, sugar, flour." }
    ]
  };

  // ---------- Cart storage ----------
  const CART_KEY = "la_tavola_cart";

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

  function setBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    badge.textContent = totalQty(readCart());
  }

  // ---------- Load category from URL ----------
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat") || "pizza";
  // Add special class for drinks / desserts pages
const itemsPage = document.getElementById("itemsPage");

if (itemsPage) {
  if (cat === "drinks") itemsPage.classList.add("drinks-page");
  if (cat === "desserts") itemsPage.classList.add("desserts-page");
}

  const titleMap = {
    pizza: "Pizza Items",
    burgers: "Burger Items",
    pasta: "Pasta Items",
    salads: "Salad Items",
    drinks: "Drinks",
    desserts: "Desserts"
  };

  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) pageTitle.textContent = titleMap[cat] || "Items";

  // ---------- Render items ----------
  const items = MENU[cat] || [];
  const grid = document.getElementById("itemsGrid");
  if (!grid) return;

  function render() {
    const cart = readCart();

    grid.innerHTML = items.map(item => {
      const qty = cart[item.id] || 0;

      return `
        <article class="item-card" data-id="${item.id}">
          <div class="image-wrap">
            <img src="${item.img}" alt="${item.name}">
            <div class="image-details">
              ${item.details}
              <small>Ingredients / details</small>
            </div>
          </div>

          <div class="item-body">
            <div class="item-name">${item.name}</div>
            <div class="item-desc">${item.desc}</div>

            ${
              qty === 0
                ? `<button class="add-btn" data-action="add" aria-label="Add to order">
                     <span class="plus">+</span>
                   </button>`
                : `<div class="qty-control" aria-label="Quantity controller">
                     <button class="qty-btn" data-action="minus" aria-label="Decrease quantity">-</button>
                     <span class="qty-num">${qty}</span>
                     <button class="qty-btn" data-action="plus" aria-label="Increase quantity">+</button>
                   </div>`
            }

            <div class="item-price">$${item.price.toFixed(2)}</div>
          </div>
        </article>
      `;
    }).join("");

    setBadge();
  }

  render();

  // ---------- Click handlers ----------
  grid.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const card = e.target.closest(".item-card");
    if (!card) return;

    const id = card.dataset.id;

    const cart = readCart();
    const current = cart[id] || 0;

    const action = actionEl.dataset.action;

    if (action === "add" || action === "plus") {
      cart[id] = current + 1;
    } else if (action === "minus") {
      const next = current - 1;
      if (next <= 0) delete cart[id];
      else cart[id] = next;
    }

    saveCart(cart);
    render();
  });

  setBadge();
});