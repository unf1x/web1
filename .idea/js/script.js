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
