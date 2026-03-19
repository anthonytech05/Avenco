// const date = new Date().toDateString()
// document.getElementById('date').innerHTML = date;

AOS.init();

// ===== DATE =====
const dateEl = document.getElementById('date');
if (dateEl) {
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLink = document.querySelector('.link');
if (hamburger && navLink) {
  hamburger.addEventListener('click', () => navLink.classList.toggle('open'));
}

// ===== CART STATE =====
let cart = [];

// ===== BUILD CART SIDEBAR =====
function buildCartSidebar() {
  if (document.getElementById('cart-sidebar')) return;

  const overlay = document.createElement('div');
  overlay.id = 'cart-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;
    opacity:0;pointer-events:none;transition:opacity 0.3s ease;
  `;
  overlay.addEventListener('click', closeCart);

  const sidebar = document.createElement('div');
  sidebar.id = 'cart-sidebar';
  sidebar.innerHTML = `
    <div id="cart-header">
      <h2>Your Cart</h2>
      <button id="close-cart">✕</button>
    </div>
    <div id="cart-items"></div>
    <div id="cart-footer">
      <div id="cart-total-row">
        <span>Total</span>
        <span id="cart-total">$0.00</span>
      </div>
      <button id="whatsapp-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="vertical-align:middle;margin-right:8px">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L.057 23.885a.5.5 0 0 0 .606.61l6.202-1.626A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.497-5.2-1.366l-.373-.219-3.862 1.013 1.029-3.755-.24-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Order via WhatsApp
      </button>
    </div>
  `;

  sidebar.style.cssText = `
    position:fixed;top:0;right:-420px;width:420px;max-width:100vw;height:100%;
    background:white;z-index:1000;display:flex;flex-direction:column;
    box-shadow:-4px 0 30px rgba(0,0,0,0.15);transition:right 0.35s cubic-bezier(0.4,0,0.2,1);
    font-family:inherit;
  `;

  const style = document.createElement('style');
  style.textContent = `
    #cart-header {
      display:flex;justify-content:space-between;align-items:center;
      padding:24px 28px;border-bottom:1px solid #eee;
    }
    #cart-header h2 { font-size:20px;font-weight:600;letter-spacing:2px;text-transform:uppercase; }
    #close-cart {
      background:none;border:none;font-size:20px;cursor:pointer;color:#555;
      transition:color 0.2s;padding:4px;
    }
    #close-cart:hover { color:black; }
    #cart-items { flex:1;overflow-y:auto;padding:20px 28px; }
    .cart-item {
      display:flex;align-items:center;gap:16px;padding:16px 0;
      border-bottom:1px solid #f0f0f0;
    }
    .cart-item-name { flex:1;font-size:15px;font-weight:500; }
    .cart-item-price { font-size:14px;color:#555;margin-top:4px; }
    .qty-controls {
      display:flex;align-items:center;gap:10px;
    }
    .qty-btn {
      width:28px;height:28px;border:1px solid #ccc;background:white;
      font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;
      transition:background 0.2s;
    }
    .qty-btn:hover { background:#f0f0f0; }
    .qty-num { font-size:15px;font-weight:600;min-width:20px;text-align:center; }
    .remove-item { color:#aaa;background:none;border:none;cursor:pointer;font-size:18px;padding:4px; }
    .remove-item:hover { color:#e00; }
    #cart-empty { text-align:center;color:#aaa;padding:60px 0;font-size:15px; }
    #cart-footer { padding:24px 28px;border-top:1px solid #eee; }
    #cart-total-row {
      display:flex;justify-content:space-between;align-items:center;
      font-size:18px;font-weight:600;margin-bottom:20px;
    }
    #whatsapp-btn {
      width:100%;padding:16px;background:#25D366;color:white;border:none;
      font-size:15px;font-weight:700;letter-spacing:1px;cursor:pointer;
      text-transform:uppercase;transition:background 0.2s;display:flex;
      align-items:center;justify-content:center;
    }
    #whatsapp-btn:hover { background:#1ebe5d; }
    .cart-badge-pulse {
      animation: badge-pop 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes badge-pop {
      0%   { transform: scale(1); }
      50%  { transform: scale(1.6); }
      100% { transform: scale(1); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('whatsapp-btn').addEventListener('click', sendWhatsApp);
}

// ===== OPEN / CLOSE CART =====
function openCart() {
  renderCartItems();
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  sidebar.style.right = '0';
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  sidebar.style.right = '-420px';
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  document.body.style.overflow = '';
}

// ===== RENDER CART ITEMS =====
function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div id="cart-empty">Your cart is empty 🛍️</div>';
    document.getElementById('cart-total').textContent = '$0.00';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div style="flex:1">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
      </div>
      <button class="remove-item" onclick="removeItem(${i})" title="Remove">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// ===== CHANGE QUANTITY =====
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartBadge();
  renderCartItems();
}

// ===== REMOVE ITEM =====
function removeItem(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCartItems();
}

// ===== UPDATE BADGE =====
function updateCartBadge() {
  const badge = document.querySelector('.button span');
  if (!badge) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = total;
  badge.classList.remove('cart-badge-pulse');
  void badge.offsetWidth;
  badge.classList.add('cart-badge-pulse');
}

// ===== ADD TO CART =====
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartBadge();
  showToast(`${name} added to cart!`);
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.getElementById('avenco-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'avenco-toast';
    toast.style.cssText = `
      position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(20px);
      background:black;color:white;padding:14px 28px;font-size:14px;letter-spacing:1px;
      font-weight:500;z-index:9999;opacity:0;
      transition:opacity 0.3s ease,transform 0.3s ease;pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2500);
}

// ===== WHATSAPP CHECKOUT =====
function sendWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty! Add items before ordering.');
    return;
  }

  const phone = '2348027626795';
  const itemList = cart.map(item =>
    `• ${item.name} x${item.qty} — $${(item.price * item.qty).toFixed(2)}`
  ).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message =
    `Hello AVENCO! 👋\n\nI'd like to place an order:\n\n${itemList}\n\n` +
    `*Total: $${total.toFixed(2)}*\n\nPlease confirm availability and delivery details. Thank you!`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ===== WIRE UP CART BUTTONS =====
function initCartButtons() {
  buildCartSidebar();

  // Make cart icon open the sidebar
  const cartBtn = document.querySelector('.button button');
  if (cartBtn) {
    cartBtn.style.cursor = 'pointer';
    cartBtn.addEventListener('click', openCart);
  }

  // Wire every "ADD TO CART" button
  document.querySelectorAll('.content').forEach(card => {
    const btn = card.querySelector('.cart');
    if (!btn) return;

    const nameEl = card.querySelector('.contact h4');
    const priceEl = card.querySelector('.contact p');

    const name = nameEl ? nameEl.textContent.trim() : 'Item';
    const priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceText) || 0;

    btn.addEventListener('click', () => addToCart(name, price));
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', initCartButtons);