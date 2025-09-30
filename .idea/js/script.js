const PRODUCTS = [
    { id: 'tshirt', title: 'Футболка', price: 1290, img: 'https://mordadovolna.com/wp-content/uploads/2019/10/ОФ-01247.png' },
    { id: 'mug',    title: 'Кружка',   price: 690,  img: 'https://png.pngtree.com/png-vector/20250529/ourmid/pngtree-sip-happens-cool-coffee-cup-funny-mug-png-image_16409476.png' },
    { id: 'bag',    title: 'Эко-сумка',price: 990,  img: 'https://png.pngtree.com/png-vector/20231017/ourmid/pngtree-empty-eco-friendly-reusable-shopping-tote-bag-with-earth-symbol-watercolor-png-image_10200596.png' },
    { id: 'cap',    title: 'Кепка',    price: 1190, img: 'https://www.karandash.by/image/design/11748/30.jpg' },
];

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
