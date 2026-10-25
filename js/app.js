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
  const cleanNumber = cfg.whatsappNumber || '919876543210';
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
    { id: 'all', name: 'அனைத்தும் (All Books)' },
    { id: 'police', name: 'போலீஸ் (Police / SI)' },
    { id: 'tet', name: 'ஆசிரியர் தகுதி (TET)' },
    { id: 'tnpsc', name: 'TNPSC' },
    { id: 'school', name: 'பள்ளிப் பாடங்கள் (6 - 12)' },
    { id: 'gk', name: 'பொது அறிவு (GK)' }
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
  const searchInput = document.getElementById('header-search-input');
  const searchClear = document.getElementById('search-clear-btn');
  const sortSelect = document.getElementById('sort-select');

  // Live Instant Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        if (searchQuery.length > 0) searchClear.classList.add('visible');
        else searchClear.classList.remove('visible');
      }
      applyFiltersAndRender();
    });

    // Clear search button
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.classList.remove('visible');
        applyFiltersAndRender();
        searchInput.focus();
      });
    }

    // Keyboard shortcut '/' to search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

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
      if (searchInput) searchInput.value = '';
      searchQuery = '';
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
        <button type="button" class="btn-primary" onclick="window.resetAllFilters()">அனைத்து புத்தகங்களையும் பார்க்க</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = books.map(book => {
    // 3 Images indicators
    const frontImg = book.images?.front || (book.gallery ? book.gallery[0].url : '');
    const badgeText = book.badge || (book.discountPercent ? `${book.discountPercent}% OFF` : '');

    return `
      <article class="book-card" data-book-id="${book.id}">
        <!-- Cover and Badge -->
        <div class="book-cover-wrap" onclick="window.navigateToBook('${book.id}')" title="${book.title} விவரங்களை பார்க்க">
          ${badgeText ? `<span class="book-badge ${book.badge === 'BESTSELLER' ? 'bestseller' : ''}">${badgeText}</span>` : ''}
          ${book.discountPercent ? `<span class="book-badge discount">${book.discountPercent}% OFF</span>` : ''}
          
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
            <span class="price-current">₹${book.price}</span>
            ${book.originalPrice ? `<span class="price-original">₹${book.originalPrice}</span>` : ''}
            ${book.discountPercent ? `<span class="price-savings">சேமிப்பு ${book.discountPercent}%</span>` : ''}
          </div>

          <!-- Action Buttons: Quick View & WhatsApp Order -->
          <div class="book-card-actions">
            <button type="button" class="btn-preview" onclick="window.openQuickViewModal('${book.id}')" title="3 விதமான படங்கள் மற்றும் விவரங்கள்">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>முன்னோட்டம்</span>
            </button>
            <button type="button" class="btn-order-wa" onclick="window.directOrder('${book.id}')" title="முகவரி கொடுத்து வாட்ஸ்அப்பில் ஆர்டர் செய்க">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
              <span>ஆர்டர் செய்க</span>
            </button>
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
  document.getElementById('quick-price').textContent = `₹${book.price}`;
  document.getElementById('quick-mrp').textContent = book.originalPrice ? `₹${book.originalPrice}` : '';
  document.getElementById('quick-discount').textContent = book.discountPercent ? `${book.discountPercent}% தள்ளுபடி` : '';
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
    orderBtn.onclick = () => {
      closeQuickViewModal();
      window.openWhatsAppOrderModal(book, 1);
    };
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
