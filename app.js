'use strict';

const products = [
  { id:'tablete-cenoura', name:'Cenoura & chocolate', category:'tabletes', image:79, description:'O encontro do bolo de cenoura com um recheio de chocolate, envolvido por uma casquinha de dar água na boca.', badge:'Uma doce combinação' },
  { id:'mini-chocolate', name:'Mini chocolate', category:'minis', image:81, description:'Pequenos doces com cobertura de chocolate e um recheio que faz a próxima mordida ser inevitável.', badge:'Para saborear' },
  { id:'bombom-dois-amores', name:'Dois amores', category:'bombons', image:85, description:'Recheios claro e de chocolate, juntos em um bombom que é um convite para uma pausa gostosa.', badge:'Dose de carinho' },
  { id:'tablete-coco', name:'Coco cremoso', category:'tabletes', image:78, description:'Chocolate e um recheio cremoso de coco. Uma combinação que deixa qualquer momento mais doce.' },
  { id:'cookie-chocolate', name:'Cookie de chocolate', category:'cookies', image:74, description:'Cookie de chocolate com o recheio em destaque. Para quem escolhe chocolate em qualquer ocasião.' },
  { id:'tablete-brownie', name:'Brownie & doce de leite', category:'tabletes', image:75, description:'Camadas de brownie e doce de leite em um tablete de chocolate. Cada pedacinho revela uma nova textura.' },
  { id:'mini-coco', name:'Mini coco', category:'minis', image:82, description:'Mini doces cobertos de chocolate com recheio de coco. Um pequeno momento para saborear sem pressa.' },
  { id:'bombom-intenso', name:'Chocolate intenso', category:'bombons', image:84, description:'Chocolate por fora e por dentro. Um bombom para quem não abre mão de uma boa dose de chocolate.' },
  { id:'tablete-amendoim', name:'Amendoim cremoso', category:'tabletes', image:76, description:'Chocolate envolvendo um recheio cremoso com pedacinhos de amendoim. Texturas que se encontram a cada mordida.' },
  { id:'mini-doce-leite', name:'Mini doce de leite', category:'minis', image:77, description:'Mini doces com cobertura de chocolate e recheio de doce de leite. Pequenos no tamanho, generosos no sabor.' },
  { id:'bombom-biscoito', name:'Chocolate & biscoito', category:'bombons', image:83, description:'Casquinha de chocolate, recheio cremoso e pedaços de biscoito. Um convite para descobrir cada camada.' },
  { id:'tablete-crocante', name:'Chocolate crocante', category:'tabletes', image:86, description:'Um tablete de chocolate com pedacinhos de biscoito para deixar sua pausa ainda mais gostosa.' },
  { id:'cookie-recheado', name:'Cookie recheado', category:'cookies', image:73, description:'Cookie com cobertura de chocolate e um recheio cremoso em destaque. Daqueles que a gente saboreia com os olhos primeiro.' },
  { id:'bombom-amendoim', name:'Chocolate & amendoim', category:'bombons', image:87, description:'A combinação de chocolate com recheio de amendoim, em um bombom que merece um lugar na sua sacolinha.' },
  { id:'tablete-doce-leite', name:'Crocante & doce de leite', category:'tabletes', image:80, description:'Chocolate, recheio crocante e uma camada cremosa de doce de leite. Uma combinação para saborear.' },
  { id:'bombom-crocante', name:'Bombom crocante', category:'bombons', image:72, description:'Uma casquinha de chocolate com recheio cremoso e textura crocante. Espie os detalhes e escolha sua próxima delícia.' },
];
const categoryNames = {tabletes:'Tablete recheado',bombons:'Bombom',minis:'Mini delícias',cookies:'Cookie'};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const asset = number => `assets/doce-${number}.jpg`;
const productById = id => products.find(p => p.id === id);
const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key,value) { try { localStorage.setItem(key,value); } catch { /* Browsing remains available without storage. */ } } };
let cart = {};
try { const saved = JSON.parse(storage.get('fairfit-cart-v1') || '{}'); for (const p of products) { const qty=saved?.[p.id]; if(Number.isInteger(qty) && qty>0 && qty<=99) cart[p.id]=qty; } } catch { cart={}; }
let selectedCategory='todos';
let expanded=false;
let detailQuantity=1;
let detailProduct=null;
let toastTimeout;
let fillingTimeout;
const cartCount=() => Object.values(cart).reduce((a,b)=>a+b,0);

function toast(message) { const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),3000); }
function saveCart(){storage.set('fairfit-cart-v1',JSON.stringify(cart));updateBag();}
function updateBag(){ const count=cartCount();$$('.bag-count').forEach(el=>el.textContent=count);$$('[data-open-cart]').forEach(el=>el.setAttribute('aria-label',`Abrir sacolinha, ${count} ${count===1?'item':'itens'}`));$('.mobile-cart').hidden=count===0; }
function addToCart(id,qty=1){if(!productById(id))return;const current=cart[id]||0;const next=Math.min(99,current+qty);if(current===next){toast('Você já selecionou o limite de 99 desse doce.');return;}cart[id]=next;saveCart();toast(`${productById(id).name} na sacolinha ♡`);}

function renderProducts(){
  const query=$('#product-search').value.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const filtered=products.filter(p => (selectedCategory==='todos'||p.category===selectedCategory) && `${p.name} ${categoryNames[p.category]}`.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query));
  const shown=expanded||selectedCategory!=='todos'||query?filtered:filtered.slice(0,6);
  $('#product-grid').innerHTML=shown.map(p=>`<article class="product-card"><div class="product-picture"><button class="product-view" data-view="${p.id}" aria-label="Ver detalhes de ${p.name}"><img src="${asset(p.image)}" alt="${categoryNames[p.category]} ${p.name} da Fair Fit" loading="lazy" width="1080" height="1350"><span class="product-hover">Espiar essa delícia ${icon('arrow')}</span></button>${p.badge?`<span class="product-badge">${p.badge}</span>`:''}</div><div class="product-info"><span class="product-type">${categoryNames[p.category]}</span><h3>${p.name}</h3><p>Valor sob consulta</p><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name} à sacolinha">${icon('plus')}</button></div></article>`).join('');
  if(!filtered.length) $('#product-grid').innerHTML='<div class="no-results"><h3>Esse doce ainda não apareceu…</h3><p>Tente outro sabor ou explore todas as delícias.</p><button class="button outline" id="clear-search">Ver todos os doces</button></div>';
  $('#menu-result').textContent=filtered.length?`${shown.length} de ${filtered.length} delícias para conhecer`:'Nenhum doce encontrado';
  $('#show-more').hidden=shown.length>=filtered.length;
}
function setCategory(category){ selectedCategory=category;expanded=false;$$('[data-filter]').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderProducts(); }
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.filter)));
$$('[data-category-link]').forEach(a=>a.addEventListener('click',()=>{$('#product-search').value='';setCategory(a.dataset.categoryLink);}));
$('#product-search').addEventListener('input',renderProducts);
$('#show-more').addEventListener('click',()=>{expanded=true;renderProducts();const cards=$$('.product-card');cards[6]?.querySelector('button')?.focus({preventScroll:true});});
$('#product-grid').addEventListener('click',e=>{const add=e.target.closest('[data-add]');const view=e.target.closest('[data-view]');if(add)addToCart(add.dataset.add);if(view)openProduct(view.dataset.view);if(e.target.closest('#clear-search')){$('#product-search').value='';setCategory('todos');$('#product-search').focus();}});

function openProduct(id){
  const p=productById(id);if(!p)return;detailProduct=p;detailQuantity=1;
  $('#product-detail').innerHTML=`<div class="product-detail-inner"><div class="detail-image"><img src="${asset(p.image)}" alt="${p.name}, em detalhe" width="1080" height="1350"></div><div class="detail-copy"><span class="product-type">${categoryNames[p.category]}</span><h2 id="product-dialog-title">${p.name}</h2><p>${p.description}</p><p class="detail-note">Consulte valores, composição e alérgenos no atendimento.</p><div class="quantity-picker" aria-label="Quantidade"><button data-detail-step="-1" aria-label="Diminuir quantidade">−</button><output id="detail-quantity" aria-live="polite">1</output><button data-detail-step="1" aria-label="Aumentar quantidade">+</button></div><button class="button primary" id="detail-add">Quero na minha sacolinha ${icon('bag')}</button></div></div>`;
  $('#product-dialog').showModal();
}
$('#product-detail').addEventListener('click',e=>{const step=e.target.closest('[data-detail-step]');if(step){detailQuantity=Math.min(99,Math.max(1,detailQuantity+Number(step.dataset.detailStep)));$('#detail-quantity').textContent=detailQuantity;}if(e.target.closest('#detail-add')&&detailProduct){addToCart(detailProduct.id,detailQuantity);$('#product-dialog').close();}});
$('[data-close-product]').addEventListener('click',()=>$('#product-dialog').close());

function renderCart(){
  const entries=Object.entries(cart);const count=cartCount();$('#cart-footer').hidden=!count;
  if(!count){$('#cart-body').innerHTML=`<div class="cart-empty">${icon('bag')}<h3>Um doce espaço<br>para os seus favoritos.</h3><p>Sua sacolinha ainda está vazia. Vamos encontrar o seu próximo doce?</p><button class="button primary" id="empty-browse">Explorar os doces ${icon('arrow')}</button></div>`;return;}
  $('#cart-body').innerHTML=entries.map(([id,qty])=>{const p=productById(id);return `<article class="cart-item"><img src="${asset(p.image)}" alt="${p.name}" width="70" height="82"><div><h3>${p.name}</h3><small>${categoryNames[p.category]} · valor sob consulta</small><div class="quantity-picker"><button data-cart-step="-1" data-id="${id}" aria-label="Diminuir quantidade de ${p.name}">−</button><output aria-label="Quantidade de ${p.name}">${qty}</output><button data-cart-step="1" data-id="${id}" aria-label="Aumentar quantidade de ${p.name}">+</button></div></div><button class="remove-item" data-remove="${id}" aria-label="Remover ${p.name} da sacolinha">Remover</button></article>`;}).join('');
  $('#cart-total').textContent=`${count} ${count===1?'item escolhido':'itens escolhidos'}`;
}
function openCart(){renderCart();$('#cart-dialog').showModal();}
$$('[data-open-cart]').forEach(b=>b.addEventListener('click',openCart));
$('[data-close-cart]').addEventListener('click',()=>$('#cart-dialog').close());
$('#cart-body').addEventListener('click',e=>{
  const step=e.target.closest('[data-cart-step]');const remove=e.target.closest('[data-remove]');
  if(step){const id=step.dataset.id;const amount=Number(step.dataset.cartStep);cart[id]=Math.min(99,Math.max(0,(cart[id]||0)+amount));if(!cart[id])delete cart[id];saveCart();renderCart();const replacement=$$('#cart-body [data-cart-step]').find(b=>b.dataset.id===id&&b.dataset.cartStep===String(amount));(replacement||$('[data-close-cart]')).focus({preventScroll:true});}
  if(remove){delete cart[remove.dataset.remove];saveCart();renderCart();$('[data-close-cart]').focus({preventScroll:true});}
  if(e.target.closest('#empty-browse')){$('#cart-dialog').close();$('#cardapio').scrollIntoView({behavior:document.documentElement.dataset.motion==='paused'?'instant':'smooth'});}
});
$('#prepare-order').addEventListener('click',()=>{
  if(!cartCount())return;const note=$('#order-note').value.trim();const lines=Object.entries(cart).map(([id,qty])=>`• ${qty}x ${categoryNames[productById(id).category]} — ${productById(id).name}`);
  $('#order-message').value=`Olá, Fair Fit! ♡ Gostaria de consultar essa seleção:\n\n${lines.join('\n')}\n\n${note?`Observação: ${note}\n\n`:''}Pode me informar os valores, a disponibilidade e as opções de entrega ou retirada?`;
  $('#copy-order').innerHTML=`Copiar minha seleção ${icon('check')}`;$('#cart-dialog').close();$('#order-dialog').showModal();
});
$('[data-close-order]').addEventListener('click',()=>$('#order-dialog').close());
$('#copy-order').addEventListener('click',async()=>{
  const message=$('#order-message');try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(message.value);$('#copy-order').innerHTML=`Seleção copiada! ${icon('check')}`;toast('Agora cole a mensagem na conversa com a Fair Fit.');}catch{message.focus();message.select();let copied=false;try{copied=document.execCommand('copy');}catch{}if(copied){$('#copy-order').innerHTML=`Seleção copiada! ${icon('check')}`;toast('Seleção copiada. Cole a mensagem no Instagram.');}else{toast('Sua mensagem está selecionada. Use a opção Copiar do seu dispositivo.');}}
});
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));

const flavors=[{image:75,alt:'Tablete de brownie e doce de leite'},{image:86,alt:'Tablete de chocolate com biscoitos crocantes'},{image:78,alt:'Tablete recheado de coco cremoso'}];
$$('[data-flavor]').forEach(button=>button.addEventListener('click',()=>{const photo=$('#filling-photo');const selected=flavors[Number(button.dataset.flavor)];$$('[data-flavor]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});clearTimeout(fillingTimeout);photo.classList.add('changing');fillingTimeout=setTimeout(()=>{photo.src=asset(selected.image);photo.alt=selected.alt;photo.onload=()=>photo.classList.remove('changing');if(photo.complete)photo.classList.remove('changing');},140);}));

const menuButton=$('.menu-button');menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');$('#mobile-nav').hidden=open;});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');$('#mobile-nav').hidden=true;}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#mobile-nav').hidden){$('#mobile-nav').hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');menuButton.focus();}});

const motionButton=$('.motion-toggle');let motionPaused=storage.get('fairfit-motion')==='paused'||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateMotion(){document.documentElement.dataset.motion=motionPaused?'paused':'running';motionButton.setAttribute('aria-pressed',String(motionPaused));const label=motionPaused?'Ativar animações':'Pausar animações';motionButton.setAttribute('aria-label',label);motionButton.title=label;motionButton.firstElementChild.textContent=motionPaused?'▷':'Ⅱ';}
motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;storage.set('fairfit-motion',motionPaused?'paused':'running');updateMotion();});updateMotion();
if('IntersectionObserver' in window){document.documentElement.classList.add('js-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.07});$$('.reveal').forEach(el=>observer.observe(el));}
$('#year').textContent=new Date().getFullYear();renderProducts();updateBag();
