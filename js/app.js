/**
 * RAJ PUBLICATION — MAIN STORE APPLICATION
 * Handles catalog rendering, instant search, category filtering, sort, and 3-image quick view
 */

let allBooks = [];
let filteredBooks = [];
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';

// Current Quick View Modal State
let quickViewBook = null;
let quickViewImageIndex = 0;

// Initialize Store
document.addEventListener('DOMContentLoaded', async () => {
  const config = await window.loadStoreConfig();
  applyStoreConfig(config);

  await loadBooksCatalog();
  initEventListeners();
  initCategoryPills();
  applyFiltersAndRender();
});

// Update DOM elements with store config
function applyStoreConfig(cfg) {
  // Update Announcement
  const annEl = document.getElementById('announcement-content');
  if (annEl && cfg.announcement) {
    annEl.textContent = cfg.announcement;
  }

  // Update WhatsApp direct links
  const waBtns = document.querySelectorAll('.js-whatsapp-link');
  const cleanNumber = cfg.whatsappNumber || '918148966638';
  const defaultText = encodeURIComponent(`வணக்கம் Raj Publication! நான் உங்கள் புத்தகங்களை வாங்க விரும்புகிறேன். விவரங்களை கூற முடியுமா?`);
  const waUrl = `https://wa.me/${cleanNumber}?text=${defaultText}`;

  waBtns.forEach(btn => {
    btn.href = waUrl;
  });

  // Footer contacts
  const footerPhone = document.getElementById('footer-phone');
  if (footerPhone) footerPhone.textContent = cfg.whatsappDisplayNumber || cfg.phone;

  const footerEmail = document.getElementById('footer-email');
  if (footerEmail) footerEmail.textContent = cfg.email;

  const footerAddr = document.getElementById('footer-address');
  if (footerAddr) footerAddr.textContent = cfg.address;
}

// Fetch books from data/books.json
async function loadBooksCatalog() {
  try {
    const res = await fetch('data/books.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    allBooks = await res.json();
    filteredBooks = [...allBooks];
  } catch (err) {
    console.error('Failed to load books catalog:', err);
    const grid = document.getElementById('books-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="no-results-card">
          <div class="no-results-icon">⚠️</div>
          <h3>புத்தகங்களை ஏற்றுவதில் சிக்கல்</h3>
          <p>புத்தக பட்டியலை ஏற்ற முடியவில்லை. தயவுசெய்து பக்கத்தை ரீலோட் செய்யவும்.</p>
        </div>
      `;
    }
  }
}

// Setup Category Pills with dynamic book counts
function initCategoryPills() {
  const container = document.getElementById('category-pills-wrap');
  if (!container) return;

  // Extract categories dynamically from loaded books
  const dynamicCategories = [
    { id: 'all', name: 'All Books' },
    { id: 'police', name: 'Police / SI' },
    { id: 'tet', name: 'TET (Paper 1 & 2)' },
    { id: 'tnpsc', name: 'TNPSC' },
    { id: 'school', name: 'School Books (6 - 12)' },
    { id: 'gk', name: 'General Knowledge (GK)' }
  ];
  const categories = dynamicCategories;

  container.innerHTML = categories.map(cat => {
    const count = cat.id === 'all' 
      ? allBooks.length 
      : allBooks.filter(b => b.category === cat.id).length;

    return `
      <button type="button" class="category-pill ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.name}</span>
        <span class="count">${count}</span>
      </button>
    `;
  }).join('');

  // Attach click listeners to pills
  container.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.category;
      applyFiltersAndRender();
    });
  });
}

// Event Listeners (Search, Sort, Modals, Keyboard shortcuts)
function initEventListeners() {
  const headerSearchInput = document.getElementById('header-search-input');
  const headerSearchClear = document.getElementById('search-clear-btn');
  const headerSearchSuggestions = document.getElementById('header-search-suggestions');
  const catalogSearchInput = document.getElementById('catalog-search-input');
  const catalogSearchClear = document.getElementById('catalog-search-clear-btn');
  const catalogSearchSuggestions = document.getElementById('catalog-search-suggestions');
  const sortSelect = document.getElementById('sort-select');

  // Helper to scroll to catalog results or a specific product card at top of viewport
  function scrollToProduct(bookId) {
    setTimeout(() => {
      const card = bookId ? document.querySelector(`.book-card[data-book-id="${bookId}"]`) : null;
      const catalog = document.getElementById('books-catalog');
      const target = card || catalog;
      if (target) {
        const headerOffset = 95;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
        if (card) {
          card.classList.remove('highlight-target');
          void card.offsetWidth;
          card.classList.add('highlight-target');
        }
      }
    }, 100);
  }

  function closeAllSuggestions() {
    if (headerSearchSuggestions) {
      headerSearchSuggestions.classList.remove('visible');
      headerSearchSuggestions.innerHTML = '';
    }
    if (catalogSearchSuggestions) {
      catalogSearchSuggestions.classList.remove('visible');
      catalogSearchSuggestions.innerHTML = '';
    }
  }

  function highlightMatch(text, query) {
    if (!text || !query) return text || '';
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.substring(0, idx);
    const match = text.substring(idx, idx + query.length);
    const after = text.substring(idx + query.length);
    return `${before}<mark>${match}</mark>${after}`;
  }

  // Render Live Suggestions Dropdown
  function renderSuggestions(query, targetDropdown) {
    if (!targetDropdown) return;
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ || cleanQ.length < 1) {
      targetDropdown.classList.remove('visible');
      targetDropdown.innerHTML = '';
      return;
    }

    const matches = allBooks.filter(book => {
      const matchTitle = (book.title || '').toLowerCase().includes(cleanQ);
      const matchTitleEn = (book.titleEn || '').toLowerCase().includes(cleanQ);
      const matchAuthor = (book.author || '').toLowerCase().includes(cleanQ);
      const matchCategory = (book.categoryName || '').toLowerCase().includes(cleanQ);
      const matchKeywords = (book.seo?.keywords || '').toLowerCase().includes(cleanQ);
      return matchTitle || matchTitleEn || matchAuthor || matchCategory || matchKeywords;
    });

    if (matches.length === 0) {
      targetDropdown.innerHTML = `<div class="suggestion-empty">புத்தகங்கள் எதுவும் காணப்படவில்லை ("${cleanQ}")</div>`;
      targetDropdown.classList.add('visible');
      return;
    }

    const topMatches = matches.slice(0, 6);
    const itemsHtml = topMatches.map(book => {
      const frontImg = book.images?.front || (book.gallery ? book.gallery[0].url : '') || book.images?.fallback || 'assets/images/books/book-placeholder.svg';
      const isAvail = Boolean(book.price && book.price > 0);
      const highlightedTitle = highlightMatch(book.title, cleanQ);
      const categoryTag = book.categoryName ? book.categoryName.split('/')[0] : '';
      const priceText = isAvail ? `₹${book.price}` : `<span class="suggestion-price unavailable">விரைவில்</span>`;

      return `
        <div class="suggestion-item" data-book-id="${book.id}">
          <img class="suggestion-thumb" src="${frontImg}" alt="${book.title}" onerror="this.onerror=null; this.src='assets/images/books/book-placeholder.svg';">
          <div class="suggestion-info">
            <div class="suggestion-title">${highlightedTitle}</div>
            <div class="suggestion-meta">
              <span class="suggestion-category">${categoryTag}</span>
              ${book.author ? `<span>• ${book.author.split(' ')[0]}</span>` : ''}
            </div>
          </div>
          <div class="suggestion-price">${priceText}</div>
        </div>
      `;
    }).join('');

    const footerHtml = `
      <div class="suggestion-view-all" id="suggestion-view-all-btn">
        <span>🔍 அனைத்து ${matches.length} முடிவுகளையும் பார்க்க (View All Results)</span>
      </div>
    `;

    targetDropdown.innerHTML = itemsHtml + footerHtml;
    targetDropdown.classList.add('visible');

    // Attach click listeners to suggestion items
    targetDropdown.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.dataset.bookId;
        const book = allBooks.find(b => b.id === bookId);
        if (book) {
          searchQuery = book.title.toLowerCase();
          if (headerSearchInput) headerSearchInput.value = book.title;
          if (catalogSearchInput) catalogSearchInput.value = book.title;
          activeCategory = 'all';
          const pills = document.querySelectorAll('.category-pill');
          pills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
          applyFiltersAndRender();
          closeAllSuggestions();
          scrollToProduct(bookId);
        }
      });
    });

    const viewAllBtn = targetDropdown.querySelector('#suggestion-view-all-btn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        closeAllSuggestions();
        scrollToProduct();
      });
    }
  }

  // Unified Search Handler (syncs both header and catalog search inputs)
  function handleSearchInput(value, source) {
    searchQuery = value.trim().toLowerCase();
    
    if (source !== 'header' && headerSearchInput && headerSearchInput.value !== value) {
      headerSearchInput.value = value;
    }
    if (source !== 'catalog' && catalogSearchInput && catalogSearchInput.value !== value) {
      catalogSearchInput.value = value;
    }

    const hasText = searchQuery.length > 0;
    if (headerSearchClear) headerSearchClear.classList.toggle('visible', hasText);
    if (catalogSearchClear) catalogSearchClear.classList.toggle('visible', hasText);

    applyFiltersAndRender();

    // Show suggestions for active search input
    if (source === 'header' && headerSearchSuggestions) {
      renderSuggestions(value, headerSearchSuggestions);
    } else if (source === 'catalog' && catalogSearchSuggestions) {
      renderSuggestions(value, catalogSearchSuggestions);
    }
  }

  function handleSearchClear() {
    searchQuery = '';
    if (headerSearchInput) headerSearchInput.value = '';
    if (catalogSearchInput) catalogSearchInput.value = '';
    if (headerSearchClear) headerSearchClear.classList.remove('visible');
    if (catalogSearchClear) catalogSearchClear.classList.remove('visible');
    closeAllSuggestions();
    applyFiltersAndRender();
  }

  // Live Instant Search Listeners
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => handleSearchInput(e.target.value, 'header'));
    headerSearchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) renderSuggestions(e.target.value, headerSearchSuggestions);
    });
    headerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        closeAllSuggestions();
        scrollToProduct();
      }
    });
  }
  if (headerSearchClear) {
    headerSearchClear.addEventListener('click', () => {
      handleSearchClear();
      headerSearchInput?.focus();
    });
  }

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => handleSearchInput(e.target.value, 'catalog'));
    catalogSearchInput.addEventListener('focus', (e) => {
      if (e.target.value.trim()) renderSuggestions(e.target.value, catalogSearchSuggestions);
    });
    catalogSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        closeAllSuggestions();
        scrollToProduct();
      }
    });
  }
  if (catalogSearchClear) {
    catalogSearchClear.addEventListener('click', () => {
      handleSearchClear();
      catalogSearchInput?.focus();
    });
  }

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-input-wrap') && !e.target.closest('.catalog-search-box')) {
      closeAllSuggestions();
    }
  });

  // Keyboard shortcut '/' to search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== headerSearchInput && document.activeElement !== catalogSearchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const targetInput = catalogSearchInput || headerSearchInput;
      targetInput?.focus();
    }
  });

  // Sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  // Reset search button from active-search info box
  const resetBtn = document.getElementById('reset-search-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      handleSearchClear();
      activeCategory = 'all';
      const pills = document.querySelectorAll('.category-pill');
      pills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
      applyFiltersAndRender();
    });
  }

  // Quick View Modal Close
  const closeQuickBtn = document.getElementById('close-quick-view-btn');
  const quickModal = document.getElementById('quick-view-modal');
  if (closeQuickBtn) closeQuickBtn.addEventListener('click', closeQuickViewModal);
  if (quickModal) {
    quickModal.addEventListener('click', (e) => {
      if (e.target === quickModal) closeQuickViewModal();
    });
  }

  // Quick view image gallery arrow navigation
  const prevBtn = document.getElementById('quick-gallery-prev');
  const nextBtn = document.getElementById('quick-gallery-next');
  if (prevBtn) prevBtn.addEventListener('click', () => switchQuickViewImage(quickViewImageIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => switchQuickViewImage(quickViewImageIndex + 1));
}

// Filtering & Sorting Logic
function applyFiltersAndRender() {
  filteredBooks = allBooks.filter(book => {
    // 1. Category Filter
    if (activeCategory !== 'all' && book.category !== activeCategory) {
      return false;
    }

    // 2. Search Query Filter
    if (searchQuery) {
      const q = searchQuery;
      const matchTitle = (book.title || '').toLowerCase().includes(q);
      const matchTitleEn = (book.titleEn || '').toLowerCase().includes(q);
      const matchAuthor = (book.author || '').toLowerCase().includes(q);
      const matchAuthorEn = (book.authorEn || '').toLowerCase().includes(q);
      const matchCategory = (book.categoryName || '').toLowerCase().includes(q);
      const matchIsbn = (book.isbn || '').toLowerCase().includes(q);
      const matchKeywords = (book.seo?.keywords || '').toLowerCase().includes(q);

      return matchTitle || matchTitleEn || matchAuthor || matchAuthorEn || matchCategory || matchIsbn || matchKeywords;
    }

    return true;
  });

  // Sorting
  switch (currentSort) {
    case 'price-low':
      filteredBooks.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredBooks.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'discount':
      filteredBooks.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      break;
    case 'featured':
    default:
      filteredBooks.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  // Update Stats & Search Info UI
  const statsEl = document.getElementById('results-count-display');
  if (statsEl) {
    statsEl.innerHTML = `மொத்தம் <span class="highlight-count">${filteredBooks.length}</span> புத்தகங்கள்`;
  }

  const searchInfo = document.getElementById('active-search-info');
  const queryLabel = document.getElementById('search-query-label');
  if (searchInfo && queryLabel) {
    if (searchQuery) {
      searchInfo.classList.add('visible');
      queryLabel.textContent = `"${searchQuery}"`;
    } else {
      searchInfo.classList.remove('visible');
    }
  }

  renderBooksGrid(filteredBooks);
}

// Render the grid of book cards
function renderBooksGrid(books) {
  const grid = document.getElementById('books-grid');
  if (!grid) return;

  if (books.length === 0) {
    grid.innerHTML = `
      <div class="no-results-card">
        <div class="no-results-icon">🔍</div>
        <h3>புத்தகங்கள் கிடைக்கவில்லை (No Books Found)</h3>
        <p>நீங்கள் தேடிய சொல் அல்லது பிரிவில் புத்தகங்கள் எதுவும் இல்லை. தயவுசெய்து வேறு பெயரைத் தேடவும்.</p>
        <button type="button" class="btn-primary" onclick="window.resetAllFilters()">Show All Books</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = books.map(book => {
    // 3 Images indicators
    const frontImg = book.images?.front || (book.gallery ? book.gallery[0].url : '');
    const isAvail = Boolean(book.price && book.price > 0);
    const badgeText = !isAvail 
      ? 'விரைவில்' 
      : (book.badge || (book.discountPercent ? `${book.discountPercent}% OFF` : ''));

    return `
      <article class="book-card" data-book-id="${book.id}">
        <!-- Cover and Badge -->
        <div class="book-cover-wrap" onclick="window.navigateToBook('${book.id}')" title="${book.title} விவரங்களை பார்க்க">
          ${!isAvail 
            ? `<span class="book-badge badge-stock-out">விரைவில் (Coming Soon)</span>`
            : (badgeText ? `<span class="book-badge ${book.badge === 'BESTSELLER' ? 'bestseller' : ''}">${badgeText}</span>` : '')
          }
          ${isAvail && book.discountPercent ? `<span class="book-badge discount">${book.discountPercent}% OFF</span>` : ''}
          
          <img class="book-cover-img" src="${frontImg}" alt="${book.title} - ${book.author} | Raj Publication" loading="lazy" onerror="this.onerror=null; this.src='${book.images?.fallback || 'assets/images/books/book-placeholder.svg'}';">
          
          <!-- 3-Image Preview Hint -->
          <div class="book-images-pill" title="3 விதமான படங்கள் உள்ளன (Front, Back, Inside Page)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>3 படங்கள்</span>
          </div>
        </div>

        <!-- Book Card Body -->
        <div class="book-body">
          <span class="book-category-tag">${book.categoryName ? book.categoryName.split('/')[0] : ''}</span>
          
          <h3 class="book-title" title="${book.title}">
            <a href="book.html?id=${book.id}">${book.title}</a>
          </h3>
          
          <div class="book-title-en">${book.titleEn || ''}</div>

          <div class="book-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>${book.author}</span>
          </div>

          <div class="book-rating-row">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${book.rating || 4.9}</span>
            <span class="review-count">(${book.reviewCount || 45})</span>
          </div>

          <!-- Price & Savings -->
          <div class="book-price-box">
            ${isAvail ? `
              <span class="price-current">₹${book.price}</span>
              ${book.originalPrice ? `<span class="price-original">₹${book.originalPrice}</span>` : ''}
              ${book.discountPercent ? `<span class="price-savings">சேமிப்பு ${book.discountPercent}%</span>` : ''}
            ` : `
              <span class="price-unavailable" style="color:var(--text-muted);font-weight:700;font-size:0.88rem;">விலை விரைவில் (Coming Soon)</span>
            `}
          </div>

          <!-- Action Buttons: Quick View & WhatsApp Order -->
          <div class="book-card-actions">
            <button type="button" class="btn-preview" onclick="window.openQuickViewModal('${book.id}')" title="Preview Images & Details">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Quick View</span>
            </button>
            ${isAvail ? `
              <button type="button" class="btn-order-wa" onclick="window.directOrder('${book.id}')" title="Order via WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                <span>Order Now</span>
              </button>
            ` : `
              <button type="button" class="btn-order-wa btn-disabled" disabled style="opacity:0.5;cursor:not-allowed;background:#94A3B8;" title="விரைவில் விற்பனைக்கு வரும் (Coming Soon)">
                <span>Unavailable</span>
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Navigate to single book page
window.navigateToBook = function(bookId) {
  window.location.href = `book.html?id=${bookId}`;
};

// Reset all filters helper
window.resetAllFilters = function() {
  const searchInput = document.getElementById('header-search-input');
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  activeCategory = 'all';
  const pills = document.querySelectorAll('.category-pill');
  pills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
  applyFiltersAndRender();
};

// Direct Order button click handler
window.directOrder = function(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;
  if (!book.price || book.price <= 0) {
    if (window.showToast) {
      window.showToast('மன்னிக்கவும், இந்தப் புத்தகம் விரைவில் விற்பனைக்கு வரும் (Coming Soon)');
    }
    return;
  }
  if (window.openWhatsAppOrderModal) {
    window.openWhatsAppOrderModal(book, 1);
  }
};

/* ==========================================================================
   QUICK VIEW MODAL WITH 3-IMAGE CAROUSEL / GALLERY
   ========================================================================== */
window.openQuickViewModal = function(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  quickViewBook = book;
  quickViewImageIndex = 0;

  const modal = document.getElementById('quick-view-modal');
  if (!modal) return;

  // Set titles
  document.getElementById('quick-title').textContent = book.title;
  document.getElementById('quick-title-en').textContent = book.titleEn || '';
  document.getElementById('quick-author').textContent = book.author;
  document.getElementById('quick-category').textContent = book.categoryName || '';
  const isAvail = Boolean(book.price && book.price > 0);
  const priceEl = document.getElementById('quick-price');
  if (priceEl) {
    if (isAvail) {
      priceEl.textContent = `₹${book.price}`;
      priceEl.style.fontSize = '';
      priceEl.style.color = '';
    } else {
      priceEl.textContent = 'விலை விரைவில் (Coming Soon)';
      priceEl.style.fontSize = '1.05rem';
      priceEl.style.color = 'var(--text-muted)';
    }
  }
  document.getElementById('quick-mrp').textContent = (isAvail && book.originalPrice) ? `₹${book.originalPrice}` : '';
  document.getElementById('quick-discount').textContent = (isAvail && book.discountPercent) ? `${book.discountPercent}% OFF` : '';
  document.getElementById('quick-desc').textContent = book.shortDescription || book.fullDescription || '';

  // Setup 3 Thumbnails
  renderQuickGalleryThumbnails(book);
  updateQuickViewGalleryDisplay();

  // Specs
  const specsTbody = document.getElementById('quick-specs-tbody');
  if (specsTbody) {
    specsTbody.innerHTML = `
      <tr><td>ISBN</td><td>${book.isbn || '-'}</td></tr>
      <tr><td>பக்கங்கள் (Pages)</td><td>${book.pages || '-'}</td></tr>
      <tr><td>மொழி (Language)</td><td>${book.language || 'தமிழ்'}</td></tr>
      <tr><td>பதிப்பகம் (Publisher)</td><td>${book.publisher || 'Raj Publication'}</td></tr>
      <tr><td>அட்டை வகை (Binding)</td><td>${book.binding || 'ஹார்ட்கவர்'}</td></tr>
    `;
  }

  // Setup Order button
  const orderBtn = document.getElementById('quick-order-btn');
  if (orderBtn) {
    if (isAvail) {
      orderBtn.disabled = false;
      orderBtn.style.opacity = '1';
      orderBtn.style.cursor = 'pointer';
      orderBtn.style.background = '';
      orderBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
        <span>Order via WhatsApp</span>
      `;
      orderBtn.onclick = () => {
        closeQuickViewModal();
        window.openWhatsAppOrderModal(book, 1);
      };
    } else {
      orderBtn.disabled = true;
      orderBtn.style.opacity = '0.5';
      orderBtn.style.cursor = 'not-allowed';
      orderBtn.style.background = '#94A3B8';
      orderBtn.innerHTML = `<span>Unavailable / Coming Soon</span>`;
      orderBtn.onclick = null;
    }
  }

  // Setup Full Page View Link
  const fullPageLink = document.getElementById('quick-fullpage-link');
  if (fullPageLink) {
    fullPageLink.href = `book.html?id=${book.id}`;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

function renderQuickGalleryThumbnails(book) {
  const thumbsWrap = document.getElementById('quick-thumbnails-wrap');
  if (!thumbsWrap) return;

  const galleryItems = book.gallery || [
    { url: book.images.front, title: 'முன் அட்டை / Front Cover' },
    { url: book.images.back, title: 'பின் அட்டை / Back Cover' },
    { url: book.images.inside, title: 'உள் பக்கம் / Inside Page' }
  ];

  thumbsWrap.innerHTML = galleryItems.map((item, idx) => `
    <button type="button" class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="window.switchQuickViewImage(${idx})">
      <img src="${item.url}" alt="${item.title}">
      <span>${item.title.split('/')[0]}</span>
    </button>
  `).join('');
}

window.switchQuickViewImage = function(index) {
  if (!quickViewBook) return;
  const galleryItems = quickViewBook.gallery || [
    { url: quickViewBook.images.front, title: 'முன் அட்டை (Front Cover)' },
    { url: quickViewBook.images.back, title: 'பின் அட்டை (Back Cover)' },
    { url: quickViewBook.images.inside, title: 'உள் பக்கம் (Sample Inside Page)' }
  ];

  if (index < 0) index = galleryItems.length - 1;
  if (index >= galleryItems.length) index = 0;

  quickViewImageIndex = index;
  updateQuickViewGalleryDisplay();
};

function updateQuickViewGalleryDisplay() {
  if (!quickViewBook) return;
  const galleryItems = quickViewBook.gallery || [
    { url: quickViewBook.images.front, title: 'முன் அட்டை / Front Cover', description: 'புத்தகத்தின் முகப்பு தோற்றம்' },
    { url: quickViewBook.images.back, title: 'பின் அட்டை / Back Cover', description: 'நூல் அறிமுகம் மற்றும் விலை குறிப்பு' },
    { url: quickViewBook.images.inside, title: 'உள் பக்கம் / Sample Inside Page', description: 'உயர்தர வாசிப்பு வடிவமைப்பு பக்கங்கள்' }
  ];

  const currentItem = galleryItems[quickViewImageIndex];
  const mainImg = document.getElementById('quick-main-image');
  const captionEl = document.getElementById('quick-gallery-caption');

  if (mainImg) {
    mainImg.src = currentItem.url;
    mainImg.alt = `${quickViewBook.title} - ${currentItem.title}`;
  }

  if (captionEl) {
    captionEl.innerHTML = `<strong>${currentItem.title}</strong> — ${currentItem.description || ''}`;
  }

  // Update active thumbnail border
  const thumbBtns = document.querySelectorAll('#quick-thumbnails-wrap .gallery-thumb-btn');
  thumbBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === quickViewImageIndex);
  });
}

function closeQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

window.closeQuickViewModal = closeQuickViewModal;
