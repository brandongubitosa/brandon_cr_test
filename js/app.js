// Simple product data (could be replaced with API calls)
const PRODUCTS = [
    { id: 'honeycrisp', name: 'Honeycrisp', price: 3.99, desc: 'Sweet, crisp, and juicy. Great for snacking.', weight: 'per lb' },
    { id: 'gala', name: 'Gala', price: 2.49, desc: 'Mild and aromatic, perfect for kids.', weight: 'per lb' },
    { id: 'fuji', name: 'Fuji', price: 2.99, desc: 'Firm texture with balanced sweetness.', weight: 'per lb' },
    { id: 'granny-smith', name: 'Granny Smith', price: 2.29, desc: 'Tart and crunchy, excellent for baking.', weight: 'per lb' },
    { id: 'braeburn', name: 'Braeburn', price: 2.79, desc: 'Bold flavor, great for salads.', weight: 'per lb' },
    { id: 'pink-lady', name: 'Pink Lady', price: 3.49, desc: 'Crisp with a tangy-sweet finish.', weight: 'per lb' }
];

// CART MANAGEMENT
const CART_KEY = 'apple_shop_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}

function addToCart(productId, qty) {
    qty = Number(qty) || 1;
    if (!cart[productId]) cart[productId] = 0;
    cart[productId] += qty;
    saveCart();
}

function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
}

function updateQty(productId, qty) {
    qty = Number(qty);
    if (qty <= 0) removeFromCart(productId);
    else { cart[productId] = qty; saveCart(); }
}

function clearCart() {
    cart = {};
    saveCart();
}

function cartTotal() {
    let total = 0;
    for (const id in cart) {
        const p = PRODUCTS.find(x => x.id === id);
        if (p) total += p.price * cart[id];
    }
    return total;
}

// RENDER PRODUCTS
const productsContainer = document.getElementById('products');
function renderProducts() {
    productsContainer.innerHTML = '';
    for (const p of PRODUCTS) {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <div class="apple-illustration" aria-hidden="true">
                <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
                    <path d="M16.5 3c-.9.1-2 1-2.6 1.8-.6.8-1.3 2.3-.7 3.6.9 2.2 3.2 3.5 5.3 3.6.1-1.6-.6-3.4-1.6-4.6C16.4 5.5 17.1 3.2 16.5 3z" fill="#d0342c"/>
                    <path d="M7 2s-.8 1-1 2 1 1 1 1 1-1 1-2-1-1-1-1z" fill="#2b7a0b"/>
                    <circle cx="9.5" cy="14" r="5.3" fill="#ffefef" opacity="0.6"/>
                </svg>
            </div>
            <div>
                <div class="title">${p.name}</div>
                <div class="meta">${p.desc} • <span style="font-weight:600">$${p.price.toFixed(2)}</span> ${p.weight}</div>
            </div>
            <div class="controls">
                <label for="qty-${p.id}" class="sr-only">Quantity</label>
                <select id="qty-${p.id}" aria-label="Quantity for ${p.name}">
                    <option value="1">1 lb</option>
                    <option value="2">2 lb</option>
                    <option value="4">4 lb</option>
                    <option value="10">10 lb</option>
                </select>
                <button class="btn" data-add="${p.id}">Add</button>
            </div>
        `;
        productsContainer.appendChild(card);
    }
}

// RENDER CART
const cartItemsEl = document.getElementById('cart-items');
const totalEl = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout');

function renderCart() {
    cartItemsEl.innerHTML = '';
    const keys = Object.keys(cart);
    if (keys.length === 0) {
        cartItemsEl.innerHTML = '<div class="empty">Your cart is empty</div>';
        totalEl.textContent = '$0.00';
        checkoutBtn.disabled = true;
        return;
    }

    for (const id of keys) {
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) continue;
        const qty = cart[id];
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <div style="width:44px;height:44px;border-radius:8px;background:#fff;display:grid;place-items:center;font-size:20px">🍎</div>
            <div style="min-width:0">
                <div class="name">${product.name}</div>
                <div class="meta" style="font-size:13px;color:var(--muted)">$${product.price.toFixed(2)} / lb</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:6px;align-items:center">
                <input type="number" min="0" value="${qty}" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd" data-update="${id}" aria-label="Quantity for ${product.name}"/>
                <div class="qty">$${(product.price * qty).toFixed(2)}</div>
                <button class="btn secondary" data-remove="${id}" title="Remove ${product.name}">Remove</button>
            </div>
        `;
        cartItemsEl.appendChild(item);
    }
    totalEl.textContent = '$' + cartTotal().toFixed(2);
    checkoutBtn.disabled = false;
}

// EVENT DELEGATION
document.body.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
        const id = add.getAttribute('data-add');
        const select = document.getElementById('qty-' + id);
        const qty = select ? select.value : 1;
        addToCart(id, qty);
        add.setAttribute('aria-pressed','true');
        setTimeout(()=>add.removeAttribute('aria-pressed'),120);
        return;
    }
    const rem = e.target.closest('[data-remove]');
    if (rem) {
        removeFromCart(rem.getAttribute('data-remove'));
        return;
    }
    if (e.target.id === 'clear-cart') {
        clearCart();
        return;
    }
    if (e.target.id === 'open-cart') {
        document.getElementById('cart').scrollIntoView({behavior:'smooth'});
    }
    if (e.target.id === 'checkout') {
        // simple mock checkout
        alert('Thank you! Checkout is a demo. Total: ' + totalEl.textContent);
        clearCart();
    }
});

// update qty inputs
document.body.addEventListener('input', (e) => {
    const inp = e.target.closest('[data-update]');
    if (inp) {
        const id = inp.getAttribute('data-update');
        const val = Number(inp.value || 0);
        updateQty(id, val);
    }
});

// keyboard friendly: allow Enter on add buttons
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target && e.target.matches('select')) {
        const parent = e.target.closest('.card');
        if (!parent) return;
        const btn = parent.querySelector('[data-add]');
        if (btn) btn.click();
    }
});

// initialize
renderProducts();
renderCart();
