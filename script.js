const categories = [...document.querySelectorAll('.category')];
const cards = [...document.querySelectorAll('.rule-card')];
const search = document.getElementById('ruleSearch');
const list = document.getElementById('rulesList');
const empty = document.getElementById('emptyState');
const title = document.getElementById('currentTitle');
const count = document.getElementById('resultCount');
const expandAll = document.getElementById('expandAll');
let activeCategory = 'all';

const categoryNames = {
  all: 'TODAS AS REGRAS',
  geral: 'TERMOS & GERAIS',
  ilegal: 'FAVELAS & ILEGAL',
  safe: 'ÁREAS SAFE & HOSPITAL',
  rp: 'REGRAS DE ROLEPLAY',
  empregos: 'EMPREGOS & MECÂNICA',
  prefeitura: 'PREFEITURA, STAFF & JURÍDICO'
};

function filterRules() {
  const term = search.value.trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  cards.forEach(card => {
    const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
    const searchMatch = !term || (card.innerText + ' ' + card.dataset.search).toLocaleLowerCase('pt-BR').includes(term);
    const show = categoryMatch && searchMatch;
    card.hidden = !show;
    if (show) visible++;
  });
  title.textContent = categoryNames[activeCategory] || categoryNames.all;
  count.textContent = `${String(visible).padStart(2, '0')} ${visible === 1 ? 'TÓPICO' : 'TÓPICOS'}`;
  empty.hidden = visible !== 0;
  list.hidden = visible === 0;
  expandAll.innerHTML = cards.some(c => !c.hidden && !c.classList.contains('open'))
    ? 'EXPANDIR TUDO <span>＋</span>' : 'RECOLHER TUDO <span>−</span>';
}

categories.forEach(button => button.addEventListener('click', () => {
  categories.forEach(item => item.classList.toggle('active', item === button));
  activeCategory = button.dataset.category;
  filterRules();
}));

if (search) {
  search.addEventListener('input', filterRules);
}

// Configuração do clique nas perguntas/regras
document.querySelectorAll('.rule-question').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const card = button.closest('.rule-card');
    const isOpen = card.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

if (expandAll) {
  expandAll.addEventListener('click', () => {
    const visibleCards = cards.filter(card => !card.hidden);
    const shouldOpen = visibleCards.some(card => !card.classList.contains('open'));
    visibleCards.forEach(card => {
      card.classList.toggle('open', shouldOpen);
      const btn = card.querySelector('.rule-question');
      if (btn) btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });
    expandAll.innerHTML = shouldOpen ? 'RECOLHER TUDO <span>−</span>' : 'EXPANDIR TUDO <span>＋</span>';
  });
}

const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.desktop-nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

filterRules();