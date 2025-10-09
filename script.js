const PRODUCTS = window.PRODUCTS;
const productsEl = document.getElementById('products');
const cartListEl = document.getElementById('cart-list');
const totalEl = document.getElementById('cart-total');
document.getElementById('year').textContent = new Date().getFullYear();

function format(n){ return n.toLocaleString('ru-RU') + ' ₽'; }

function renderProducts(){
    productsEl.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <img src="${p.img}" alt="${p.title}">
      <div class="content">
        <h3>${p.title}</h3>
        <div class="price">${format(p.price)}</div>
        <button class="btn add-btn" data-id="${p.id}">Добавить в корзину</button>
      </div>
    </article>
  `).join('');
}
renderProducts();


const CART_KEY = 'simple-shop-cart';
let cart = loadCart();

function loadCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? {}; }
    catch { return {}; }
}
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(id){
    cart[id] = (cart[id] ?? 0) + 1;
    saveCart(); renderCart();
}
function removeFromCart(id){
    delete cart[id];
    saveCart(); renderCart();
}
function changeQty(id, delta){
    cart[id] = Math.max(1, (cart[id] ?? 1) + delta);
    saveCart(); renderCart();
}
function getProduct(id){ return PRODUCTS.find(p => p.id === id); }

function renderCart(){
    const entries = Object.entries(cart);
    if(entries.length === 0){
        cartListEl.innerHTML = `<li>Корзина пуста</li>`;
        totalEl.textContent = format(0);
        return;
    }
    let sum = 0;
    cartListEl.innerHTML = entries.map(([id, qty]) => {
        const p = getProduct(id);
        const line = p.price * qty; sum += line;
        return `
      <li class="cart-item">
        <span class="title">${p.title}</span>
        <div class="qty">
          <button class="icon-btn" data-act="dec" data-id="${id}">−</button>
          <span>${qty}</span>
          <button class="icon-btn" data-act="inc" data-id="${id}">+</button>
          <button class="icon-btn" data-act="del" data-id="${id}" title="Удалить">✕</button>
        </div>
        <span class="line">${format(line)}</span>
      </li>`;
    }).join('');
    totalEl.textContent = format(sum);
}

productsEl.addEventListener('click', e=>{
    const btn = e.target.closest('.add-btn');
    if(!btn) return;
    addToCart(btn.dataset.id);
});

cartListEl.addEventListener('click', e=>{
    const btn = e.target.closest('button[data-act]');
    if(!btn) return;
    const id = btn.dataset.id;
    const act = btn.dataset.act;
    if(act==='inc') changeQty(id, +1);
    if(act==='dec') changeQty(id, -1);
    if(act==='del') removeFromCart(id);
});

renderCart();

const modal = document.getElementById('order-modal');
const openBtn = document.getElementById('checkout-btn');
const form = document.getElementById('order-form');

function openModal(){
    if(Object.keys(cart).length === 0){ alert('Корзина пуста'); return; }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
}
function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
}
openBtn.addEventListener('click', openModal);
modal.addEventListener('click', e=>{ if(e.target.hasAttribute('data-close')) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!form.reportValidity()) return;
    alert('Заказ создан!');
    cart = {}; saveCart(); renderCart();
    form.reset(); closeModal();
});
