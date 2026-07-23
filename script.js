const catalog = {
  'لاتيه ومشروبات الحليب': {
    icon:'🥛',
    items:[
      {slug:'latte-classic', name:'لاتيه كلاسيك', desc:'إسبريسو مع حليب مبخر ورغوة ناعمة.', price:4000},
      {slug:'latte-spanish', name:'سبانش لاتيه', desc:'لاتيه بحليب مكثف محلى بلمسة قرفة.', price:5000},
      {slug:'latte-hazelnut', name:'لاتيه بندق', desc:'نكهة البندق المحمص مع طبقة كريمة خفيفة.', price:5500},
      {slug:'flat-white', name:'فلات وايت', desc:'إسبريسو مضاعف بحليب قليل الرغوة.', price:4500},
      {slug:'cappuccino', name:'كابتشينو', desc:'توازن كلاسيكي بين الإسبريسو والحليب المرغي.', price:4000},
      {slug:'mocha', name:'موكا', desc:'إسبريسو مع شوكولاتة داكنة وحليب مبخر.', price:5000},
    ]
  },
  'قهوة مختصة': {
    icon:'☕',
    items:[
      {slug:'v60', name:'V60 مقطّرة', desc:'تحضير يدوي يبرز نكهات حبة القهوة الأصلية.', price:6000},
      {slug:'espresso-double', name:'إسبريسو مضاعف', desc:'جرعة مركزة من حبوب محمصة طازجة.', price:3000},
      {slug:'americano', name:'أمريكانو', desc:'إسبريسو ممدد بالماء الساخن، نقي وخفيف.', price:3500},
      {slug:'cold-brew', name:'كولد برو', desc:'تخمير بارد لمدة ١٦ ساعة، نعومة بلا حموضة.', price:5500},
      {slug:'pour-over', name:'قهوة مقطرة يدوية', desc:'تشكيلة أصول موسمية تُحضّر حسب الطلب.', price:6500},
    ]
  },
  'شاي': {
    icon:'🍵',
    items:[
      {slug:'tea-red', name:'شاي أحمر', desc:'أوراق شاي سيلاني مغلية على أصولها.', price:2500},
      {slug:'tea-green-mint', name:'شاي أخضر بالنعناع', desc:'شاي أخضر مع أوراق نعناع طازجة.', price:3000},
      {slug:'tea-karak', name:'شاي كرك', desc:'شاي بالحليب والهيل والزنجبيل على الطريقة الخليجية.', price:3500},
      {slug:'tea-fruit', name:'شاي فواكه ساخن', desc:'مزيج توت وفواكه حمراء بدون كافيين.', price:3000},
    ]
  },
  'إضافات وحلا': {
    icon:'🥐',
    items:[
      {slug:'croissant', name:'كرواسون زبدة', desc:'طبقات مقرمشة تُخبز طازجة يومياً.', price:2500},
      {slug:'dates-coffee', name:'تمر وقهوة عربية', desc:'ثلاث حبات تمر مع فنجان قهوة عربية.', price:2000},
      {slug:'cookies', name:'كوكيز شوكولاتة', desc:'قطعة كوكيز محشوة بقطع شوكولاتة داكنة.', price:2000},
      {slug:'milk-alt', name:'حليب بديل إضافي', desc:'لوز، شوفان أو صويا — إضافة لأي مشروب.', price:1000},
    ]
  }
};

const IMG_BASE = 'images/';
const currency = v => v.toLocaleString('ar') + ' د.ع';

const catNav = document.getElementById('catNav');
const menuWrap = document.getElementById('menu');
let cart = {}; // slug -> {qty, price, icon, name, slug}

const catKeys = Object.keys(catalog);
catKeys.forEach((cat, i)=>{
  const btn = document.createElement('button');
  btn.textContent = cat;
  btn.dataset.cat = cat;
  if(i===0) btn.classList.add('active');
  btn.onclick = ()=>{
    document.getElementById('sec-'+i).scrollIntoView({behavior:'smooth', block:'start'});
  };
  catNav.appendChild(btn);
});

catKeys.forEach((cat, i)=>{
  const data = catalog[cat];
  const block = document.createElement('div');
  block.className = 'cat-block';
  block.id = 'sec-'+i;
  block.innerHTML = `
    <div class="cat-head">
      <div class="num"><span>${i+1}</span></div>
      <h2>${cat}</h2>
      <div class="line"></div>
    </div>
    <div class="items">
      ${data.items.map(it=>`
        <div class="item">
          <div class="photo">
            <img src="${IMG_BASE}${it.slug}.jpg" alt="${it.name}" loading="lazy"
                 onerror="this.classList.add('broken')">
            <div class="placeholder">${data.icon}</div>
          </div>
          <span class="cat-tag">${cat}</span>
          <div class="info">
            <h3>${it.name}</h3>
            <div class="row">
              <span class="price">${it.price.toLocaleString('ar')} د.ع</span>
              <button class="add-circle" data-slug="${it.slug}" data-price="${it.price}"
                      data-icon="${data.icon}" data-name="${it.name}">+</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  menuWrap.appendChild(block);
});

// scrollspy for nav active state
const sections = catKeys.map((_,i)=> document.getElementById('sec-'+i));
window.addEventListener('scroll', ()=>{
  let idx = 0;
  sections.forEach((s,i)=>{ if(s.getBoundingClientRect().top < 140) idx = i; });
  [...catNav.children].forEach((b,i)=> b.classList.toggle('active', i===idx));
}, {passive:true});

menuWrap.addEventListener('click', e=>{
  const btn = e.target.closest('.add-circle');
  if(!btn) return;
  const slug = btn.dataset.slug;
  const price = Number(btn.dataset.price);
  const icon = btn.dataset.icon;
  const name = btn.dataset.name;
  if(!cart[slug]) cart[slug] = {qty:0, price, icon, name, slug};
  cart[slug].qty += 1;
  updateCartUI();
  btn.textContent = '✓';
  btn.classList.add('added');
  showToast('أُضيف إلى طلبك');
  setTimeout(()=>{ btn.textContent='+'; btn.classList.remove('added'); }, 900);
});

const cartBody = document.getElementById('cartBody');
const cartCount = document.getElementById('cartCount');
const sumCount = document.getElementById('sumCount');
const sumTotal = document.getElementById('sumTotal');

function changeQty(slug, delta){
  if(!cart[slug]) return;
  cart[slug].qty += delta;
  if(cart[slug].qty<=0) delete cart[slug];
  updateCartUI();
}
function removeItem(slug){ delete cart[slug]; updateCartUI(); }

function updateCartUI(){
  const keys = Object.keys(cart);
  const totalQty = keys.reduce((s,k)=> s+cart[k].qty, 0);
  cartCount.textContent = totalQty;
  sumCount.textContent = totalQty;

  if(keys.length===0){
    cartBody.innerHTML = `<div class="empty">لا يوجد شيء بعد<br>اختر مشروبك المفضل من القائمة ☕</div>`;
    sumTotal.textContent = '٠ د.ع';
    return;
  }
  let total = 0;
  cartBody.innerHTML = keys.map(k=>{
    const it = cart[k];
    total += it.qty * it.price;
    return `
      <div class="d-item">
        <div class="d-icon">
          <img src="${IMG_BASE}${it.slug}.jpg" alt="${it.name}" onerror="this.style.display='none'; this.parentElement.textContent='${it.icon}';">
        </div>
        <div class="d-info">
          <h5>${it.name}</h5>
          <div class="dp">${it.price.toLocaleString('ar')} د.ع</div>
          <div class="qty">
            <button onclick="changeQty('${k}',-1)">−</button>
            <span>${it.qty}</span>
            <button onclick="changeQty('${k}',1)">+</button>
          </div>
        </div>
        <button class="rm" onclick="removeItem('${k}')">إزالة</button>
      </div>
    `;
  }).join('');
  sumTotal.textContent = currency(total);
}

const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
document.getElementById('cartOpenBtn').onclick = ()=>{ drawer.classList.add('open'); overlay.classList.add('open'); };
document.getElementById('closeCartBtn').onclick = closeDrawer;
overlay.onclick = closeDrawer;
function closeDrawer(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }

const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2000);
}

updateCartUI();
