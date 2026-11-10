(function () {
  'use strict';
  var FB = 'https://www.facebook.com/profile.php?id=61562022416678';

  /* ---- Sample products: replace names, prices and descriptions with real ones ---- */
  var PRODUCTS = [
    { id: 'c1', brand: 'cake', name: 'Chocolate Truffle Cake', desc: 'Rich cocoa sponge with chocolate ganache.', price: 1200, unit: '1 lb', emoji: '🎂' },
    { id: 'c2', brand: 'cake', name: 'Red Velvet Cake', desc: 'Soft red sponge with cream cheese frosting.', price: 1400, unit: '1 lb', emoji: '🍰' },
    { id: 'c3', brand: 'cake', name: 'Birthday Fun Cake', desc: 'Custom message, colours and toppers.', price: 1500, unit: '2 lb', emoji: '🎉' },
    { id: 'c4', brand: 'cake', name: 'Vanilla Cupcakes', desc: 'Box of 6 with buttercream swirl.', price: 450, unit: 'box of 6', emoji: '🧁' },
    { id: 'c5', brand: 'cake', name: 'Butter Cookies', desc: 'Crisp, golden, baked fresh.', price: 300, unit: '250 g', emoji: '🍪' },
    { id: 'c6', brand: 'cake', name: 'Brownie Box', desc: 'Fudgy brownies with walnut.', price: 500, unit: 'box of 6', emoji: '🍫' },
    { id: 't1', brand: 'traders', name: 'Miniket Rice', desc: 'Clean, polished everyday rice.', price: 78, unit: 'per kg', emoji: '🌾' },
    { id: 't2', brand: 'traders', name: 'Soybean Oil', desc: 'Sealed bottle for daily cooking.', price: 180, unit: 'per litre', emoji: '🫒' },
    { id: 't3', brand: 'traders', name: 'Sugar', desc: 'Fine white sugar.', price: 130, unit: 'per kg', emoji: '🍬' },
    { id: 't4', brand: 'traders', name: 'Red Lentil (Masur Dal)', desc: 'Cleaned and sorted.', price: 125, unit: 'per kg', emoji: '🫘' },
    { id: 't5', brand: 'traders', name: 'Flour (Atta)', desc: 'Whole wheat flour for rutis.', price: 60, unit: 'per kg', emoji: '🥖' },
    { id: 't6', brand: 'traders', name: 'Salt', desc: 'Iodised table salt.', price: 45, unit: 'per kg', emoji: '🧂' }
  ];

  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('tcz-cart') || '{}'); } catch (e) { cart = {}; }

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) { return '৳' + n.toLocaleString('en-US'); }
  function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function save() { try { localStorage.setItem('tcz-cart', JSON.stringify(cart)); } catch (e) {} }
  function count() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k] * find(k).price; }, 0); }

  /* ---- Mobile menu ---- */
  var menuBtn = $('.menu-btn'), links = $('.nav-links');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  /* ---- Scroll reveal (only on elements marked .reveal) ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .15 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('in'); }); }

  /* ---- Hero sprinkles ---- */
  var stage = $('.cake-stage');
  if (stage) {
    var cols = ['#d63f6c', '#ffd27d', '#9ccb8f', '#fff', '#5ab0e8'];
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('i');
      s.className = 'sprinkle';
      s.style.cssText = 'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;background:' + cols[i % cols.length] +
        ';--r:' + (Math.random() * 180) + 'deg;animation-delay:' + (Math.random() * -6) + 's;animation-duration:' + (5 + Math.random() * 4) + 's;opacity:.8';
      s.setAttribute('aria-hidden', 'true');
      stage.appendChild(s);
    }
  }

  /* ---- Product cards ---- */
  function card(p) {
    return '<article class="product ' + p.brand + '">' +
      '<div class="product-art" aria-hidden="true"><span>' + p.emoji + '</span></div>' +
      '<div class="product-body"><h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
      '<div class="product-foot"><div class="price">' + money(p.price) + ' <small>' + p.unit + '</small></div>' +
      '<button class="btn add-btn" data-add="' + p.id + '">Add to order</button></div></div></article>';
  }

  var featured = $('#featured-grid');
  if (featured) featured.innerHTML = ['c1', 'c4', 't1', 't2'].map(function (id) { return card(find(id)); }).join('');

  var grid = $('#shop-grid');
  if (grid) {
    var state = { brand: 'all', q: '' };
    var render = function () {
      var list = PRODUCTS.filter(function (p) {
        return (state.brand === 'all' || p.brand === state.brand) &&
          (p.name + ' ' + p.desc).toLowerCase().indexOf(state.q) > -1;
      });
      grid.innerHTML = list.length ? list.map(card).join('') :
        '<div class="empty"><h3>No items found</h3><p>Try another word, or choose All.</p></div>';
      $('#result-count').textContent = list.length + ' item' + (list.length === 1 ? '' : 's');
    };
    $$('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        state.brand = c.dataset.brand;
        $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
        render();
      });
    });
    $('#search').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
    if (location.hash === '#traders' || location.hash === '#cake') {
      state.brand = location.hash.slice(1);
      $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.brand === state.brand); });
    }
    render();
  }

  /* ---- Cart drawer ---- */
  var bg = document.createElement('div'); bg.className = 'drawer-bg';
  var drawer = document.createElement('aside'); drawer.className = 'drawer';
  drawer.setAttribute('aria-label', 'Your order'); drawer.setAttribute('role', 'dialog');
  drawer.innerHTML = '<header><h2>Your order</h2><button class="icon-btn" aria-label="Close order">✕</button></header>' +
    '<div class="drawer-body"></div>' +
    '<footer><div class="total"><span>Total</span><span id="cart-total">৳0</span></div>' +
    '<button class="btn" id="send-order" style="width:100%;justify-content:center">Send order on Facebook</button>' +
    '<p class="note" style="margin:.8rem 0 0">Your order text is copied. Paste it in our Facebook message and we will confirm price and delivery.</p></footer>';
  var toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(bg); document.body.appendChild(drawer); document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }
  function openCart() { document.body.classList.add('cart-open'); }
  function closeCart() { document.body.classList.remove('cart-open'); }

  function renderCart() {
    var body = $('.drawer-body', drawer), ids = Object.keys(cart);
    body.innerHTML = ids.length ? ids.map(function (id) {
      var p = find(id);
      return '<div class="cart-row"><span class="em" aria-hidden="true">' + p.emoji + '</span>' +
        '<div><strong>' + p.name + '</strong><br><span class="note">' + money(p.price) + ' · ' + p.unit + '</span></div>' +
        '<div class="qty"><button data-dec="' + id + '" aria-label="Less">−</button><span>' + cart[id] + '</span><button data-inc="' + id + '" aria-label="More">+</button></div></div>';
    }).join('') : '<div class="empty"><h3>Nothing here yet</h3><p>Add a cake or a grocery item from the shop.</p><a class="btn" href="shop.html">Go to shop</a></div>';
    $('#cart-total').textContent = money(total());
    $$('.cart-count').forEach(function (c) { c.textContent = count(); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); });
    $('#send-order').disabled = !ids.length;
    save();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('button,a'); if (!t) return;
    if (t.dataset.add) {
      cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1; renderCart();
      t.classList.add('added'); t.textContent = 'Added ✓';
      setTimeout(function () { t.classList.remove('added'); t.textContent = 'Add to order'; }, 1100);
    } else if (t.dataset.inc) { cart[t.dataset.inc]++; renderCart(); }
    else if (t.dataset.dec) { if (--cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec]; renderCart(); }
    else if (t.hasAttribute('data-open-cart')) { e.preventDefault(); openCart(); }
    else if (t.classList.contains('icon-btn') && drawer.contains(t)) closeCart();
  });
  bg.addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  $('#send-order').addEventListener('click', function () {
    var lines = Object.keys(cart).map(function (id) { var p = find(id); return '• ' + p.name + ' × ' + cart[id] + ' (' + money(p.price * cart[id]) + ')'; });
    var text = "Hello! I would like to order:\n" + lines.join('\n') + '\nTotal: ' + money(total());
    function go() { showToast('Order copied. Paste it in the message.'); window.open(FB, '_blank', 'noopener'); }
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(go, go); else go();
  });

  /* ---- Contact form (opens Facebook with the message copied) ---- */
  var form = $('#contact-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var text = 'Name: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\nTopic: ' + d.get('topic') + '\n' + d.get('message');
    var go = function () { showToast('Message copied. Paste it on our Facebook page.'); window.open(FB, '_blank', 'noopener'); form.reset(); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(go, go); else go();
  });

  renderCart();
})();
