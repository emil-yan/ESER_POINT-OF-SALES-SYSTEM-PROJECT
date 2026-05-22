/**
 * =============================================================================
 * CHIBUGBOG POS — pos.js
 * Point of Sale logic for Chibugbog restaurant.
 *
 * Responsibilities:
 *   1. Define the menu (MENU constant)
 *   2. Dynamically build menu cards from the data
 *   3. Manage the current order (add, remove, change quantity)
 *   4. Calculate and display the running total
 *   5. Handle payment: validate cash, compute change, reset on success
 *   6. Show toast notifications for user feedback
 * =============================================================================
 */

'use strict';


/* ── 1. MENU DATA ─────────────────────────────────────────────────────────────
   Each key is the display name shown on the card and in the order list.
   Add, remove, or edit items here — the UI builds itself from this object.
   ──────────────────────────────────────────────────────────────────────────── */
/*
 * To swap any image: change the `image` path to your file, e.g.
 *   image: 'images/lechon.jpg'
 *
 * Any photo dimension works — the CSS handles all cropping automatically.
 * Supported formats: jpg, jpeg, png, webp, avif, gif.
 * Place your image files inside an `images/` folder next to index.html.
 */
const MENU = {
  'Lechon Paksiw Bowl': { price: 99,  image: 'images/lechon-paksiw.jpg' },
  'Sugpo sa Gata':      { price: 149, image: 'images/sugpo-sa-gata.jpg' },
  'Inihaw na Bangus':   { price: 129, image: 'images/inihaw-bangus.webp' },
  'Tapsilog Royale':    { price: 119, image: 'images/tapsilog.webp'      },
  'Kare-Kare Pata':     { price: 169, image: 'images/kare-kare.jpeg'     },
  'Adobo Flakes Rice':  { price: 89,  image: 'images/adobo-flakes.jpg'  },
  'Crispy Bagnet':      { price: 159, image: 'images/bagnet.webp'        },
  'Longsilog Hamonado': { price: 109, image: 'images/longsilog.jpg'     },
  'Salabat Lemonade':   { price: 59,  image: 'images/salabat.jpg'       },
  'Buko Pandan Shake':  { price: 79,  image: 'images/buko-pandan.jpg'   },
};


/* ── 2. ORDER STATE ────────────────────────────────────────────────────────────
   Holds the live order as { itemName: quantity }.
   Mutated by addItem, changeQty, and removeItem.
   ──────────────────────────────────────────────────────────────────────────── */
let order = {};


/* ── 3. DOM REFERENCES ─────────────────────────────────────────────────────── */
const menuGrid      = document.getElementById('menuGrid');
const orderItems    = document.getElementById('orderItems');
const itemCountEl   = document.getElementById('itemCount');
const totalDisplay  = document.getElementById('totalDisplay');
const cashInput     = document.getElementById('cashInput');
const payBtn        = document.getElementById('payBtn');
const changeDisplay = document.getElementById('changeDisplay');
const changeVal     = document.getElementById('changeVal');
const toastEl       = document.getElementById('toast');


/* ── 4. BUILD MENU CARDS ───────────────────────────────────────────────────────
   Iterates MENU and injects a .menu-card div for each item into #menuGrid.
   Clicking any card calls addItem() with that item's name.
   ──────────────────────────────────────────────────────────────────────────── */
function buildMenuCards() {
  Object.entries(MENU).forEach(([name, { price, image }]) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="item-img-wrap">
        <img src="${image}" alt="${name}" loading="lazy" />
      </div>
      <div class="item-name">${name}</div>
      <div class="item-price">₱${price}</div>
      <div class="add-hint">+</div>
    `;
    card.addEventListener('click', () => addItem(name));
    menuGrid.appendChild(card);
  });
}


/* ── 5. ORDER LOGIC ────────────────────────────────────────────────────────────

   addItem(name)
     Increments qty for the given item (or sets to 1 if new).
     Triggers a re-render and a toast notification.

   changeQty(name, delta)
     Adjusts qty by delta (+1 or -1).
     Removes the item from the order entirely when qty reaches 0.
     Exposed on window so inline onclick handlers in the rendered HTML can call it.

   removeItem(name)
     Deletes the item from order immediately.
     Exposed on window for the same reason as changeQty.

   getTotal()
     Sums price × qty across all order entries and returns the number.
   ──────────────────────────────────────────────────────────────────────────── */

function addItem(name) {
  order[name] = (order[name] || 0) + 1;
  renderOrder();
  showToast(`${name} added!`);
}

// Exposed globally so the inline onclick in renderOrder's template can reach it
window.changeQty = function (name, delta) {
  order[name] = (order[name] || 0) + delta;
  if (order[name] <= 0) delete order[name];
  renderOrder();
};

// Exposed globally for the same reason
window.removeItem = function (name) {
  delete order[name];
  renderOrder();
};

function getTotal() {
  return Object.entries(order).reduce((sum, [name, qty]) => {
    return sum + (MENU[name]?.price ?? 0) * qty;
  }, 0);
}


/* ── 6. RENDER ORDER LIST ──────────────────────────────────────────────────────
   Rebuilds the #orderItems container from the current order state.
   Also updates the item count badge and the total display.
   Called after every state mutation.
   ──────────────────────────────────────────────────────────────────────────── */
function renderOrder() {
  const total     = getTotal();
  const itemCount = Object.values(order).reduce((a, b) => a + b, 0);

  // Update summary values
  itemCountEl.textContent  = itemCount;
  totalDisplay.textContent = `₱${total.toFixed(2)}`;

  // Empty state
  if (Object.keys(order).length === 0) {
    orderItems.innerHTML = '<p class="order-empty">No items yet — tap a menu card to start.</p>';
    updatePayBtn();
    return;
  }

  // Build order item rows
  orderItems.innerHTML = Object.entries(order).map(([name, qty]) => {
    const subtotal = (MENU[name]?.price ?? 0) * qty;
    // Note: changeQty and removeItem are called via inline onclick because
    // this HTML string is injected with innerHTML, outside the normal event scope.
    return `
      <div class="order-item">
        <span class="oi-name">${name}</span>
        <div class="oi-qty-ctrl">
          <button class="qty-btn" onclick="changeQty('${name}', -1)">−</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${name}', +1)">+</button>
        </div>
        <span class="oi-sub">₱${subtotal}</span>
        <button class="remove-btn" onclick="removeItem('${name}')" title="Remove item">✕</button>
      </div>
    `;
  }).join('');

  updatePayBtn();
  updateChange();
}


/* ── 7. PAYMENT LOGIC ──────────────────────────────────────────────────────────

   updatePayBtn()
     Enables Pay! only when: there are items AND cash ≥ total AND cash > 0.

   updateChange()
     Shows the change-display row when the cash entered is sufficient.
     Hides it otherwise.
   ──────────────────────────────────────────────────────────────────────────── */

function updatePayBtn() {
  const hasItems = Object.keys(order).length > 0;
  const cash     = parseFloat(cashInput.value) || 0;
  const total    = getTotal();
  payBtn.disabled = !hasItems || cash < total || cash === 0;
}

function updateChange() {
  const cash  = parseFloat(cashInput.value) || 0;
  const total = getTotal();

  if (cash > 0 && total > 0 && cash >= total) {
    changeDisplay.style.display = 'flex';
    changeVal.textContent = `₱${(cash - total).toFixed(2)}`;
  } else {
    changeDisplay.style.display = 'none';
  }
}

// Re-validate pay button and change whenever cash input changes
cashInput.addEventListener('input', () => {
  updatePayBtn();
  updateChange();
});

// Process payment: show confirmation toast, then reset everything
payBtn.addEventListener('click', () => {
  const cash   = parseFloat(cashInput.value);
  const total  = getTotal();
  const change = cash - total;

  showToast(`✅ Order complete! Change: ₱${change.toFixed(2)}`, 4000);

  // Reset order state and UI
  order = {};
  cashInput.value = '';
  changeDisplay.style.display = 'none';
  renderOrder();
});


/* ── 8. TOAST NOTIFICATION ─────────────────────────────────────────────────────
   Shows a brief slide-up message at the bottom-right of the screen.
   Auto-dismisses after `duration` ms. Calling it again resets the timer.
   ──────────────────────────────────────────────────────────────────────────── */
let toastTimer;

function showToast(msg, duration = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}


/* ── INIT ──────────────────────────────────────────────────────────────────────
   Entry point — builds the menu cards once the script loads.
   ──────────────────────────────────────────────────────────────────────────── */
buildMenuCards();
