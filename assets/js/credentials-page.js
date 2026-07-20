(() => {
  'use strict';
  const data = Array.isArray(window.DG_CREDENTIALS) ? window.DG_CREDENTIALS : [];
  const list = document.querySelector('[data-credential-list]');
  const search = document.querySelector('[data-credential-search]');
  const filters = document.querySelector('[data-category-filters]');
  const roleFilter = document.querySelector('[data-role-filter]');
  const count = document.querySelector('[data-credential-count]');
  if (!list || !search || !filters || !roleFilter || !count) return;

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const categories = ['All', ...new Set(data.map((item) => item.category))];
  let activeCategory = 'All';

  function renderFilters() {
    filters.innerHTML = categories.map((category) => `<button type="button" class="filter-button" aria-pressed="${category === activeCategory}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
    filters.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderFilters();
      render();
    }));
  }

  function render() {
    const term = search.value.trim().toLowerCase();
    const role = roleFilter.value;
    const filtered = data.filter((item) => {
      const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
      const roleMatch = role === 'All' || item.roles.includes(role);
      const haystack = `${item.title} ${item.category} ${item.date} ${item.roles.join(' ')}`.toLowerCase();
      return categoryMatch && roleMatch && (!term || haystack.includes(term));
    });
    count.textContent = String(filtered.length);
    if (!filtered.length) {
      list.innerHTML = '<div class="no-results"><strong>No matching records.</strong><br>Try a broader search, category, or role.</div>';
      return;
    }
    list.innerHTML = filtered.map((item) => `<article class="credential-record">
      <span class="credential-index">${String(item.id).padStart(2, '0')}</span>
      <div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.category)} · ${escapeHTML(item.provider)}</p><div class="credential-tags">${item.roles.slice(0, 2).map((r) => `<span>${escapeHTML(r)}</span>`).join('')}</div></div>
      <time>${escapeHTML(item.date)}</time>
    </article>`).join('');
  }

  search.addEventListener('input', render);
  roleFilter.addEventListener('change', render);
  renderFilters();
  render();
})();
