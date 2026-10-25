/**
 * RAJ PUBLICATION — DEDICATED BOOK DETAIL PAGE CONTROLLER
 * Handles SEO injection (OpenGraph, Schema.org Book JSON-LD), 3-image gallery, tabs, lightbox, and WhatsApp checkout
 */

let currentBook = null;
let currentImageIndex = 0;
let allCatalogBooks = [];

document.addEventListener('DOMContentLoaded', async () => {
  const config = await window.loadStoreConfig();
  await loadSingleBookData();
  initTabs();
  initLightbox();
});

// Load book data based on URL query param ?id=...
async function loadSingleBookData() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  try {
    const res = await fetch('data/books.json');
    if (!res.ok) throw new Error('Failed to load books');
    allCatalogBooks = await res.json();

    if (bookId) {
      currentBook = allCatalogBooks.find(b => b.id === bookId);
    }
    // Fallback to first book if id not found
    if (!currentBook && allCatalogBooks.length > 0) {
      currentBook = allCatalogBooks[0];
    }

    if (currentBook) {
      renderBookDetails(currentBook);
      injectSEO(currentBook);
      renderRelatedBooks(currentBook);
    } else {
      showBookNotFound();
    }
  } catch (err) {
    console.error('Error loading book:', err);
    showBookNotFound();
  }
}

// Inject Dynamic Pure SEO: Title, Meta Description, Open Graph, Twitter Cards, Schema.org JSON-LD
function injectSEO(book) {
  // Title tag
  const pageTitle = book.seo?.metaTitle || `${book.title} | Raj Publication Tamil Books`;
  document.title = pageTitle;

  // Meta description
  const metaDesc = book.seo?.metaDescription || book.shortDescription || `${book.title} புத்தகம் வாங்க வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.`;
  updateMetaTag('name', 'description', metaDesc);

  // Keywords
  if (book.seo?.keywords) {
    updateMetaTag('name', 'keywords', book.seo.keywords);
  }

  // Canonical URL
  const pageUrl = `https://rajpublication.com/book.html?id=${encodeURIComponent(book.id)}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = pageUrl;

  // OpenGraph Tags
  updateMetaTag('property', 'og:title', pageTitle);
  updateMetaTag('property', 'og:description', metaDesc);
  updateMetaTag('property', 'og:url', pageUrl);
  updateMetaTag('property', 'og:type', 'book');
  const frontImg = book.images?.front || (book.gallery ? book.gallery[0].url : '');
  if (frontImg) {
    const absImg = new URL(frontImg, window.location.origin).href;
    updateMetaTag('property', 'og:image', absImg);
    updateMetaTag('name', 'twitter:image', absImg);
  }

  // Twitter Card
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', pageTitle);
  updateMetaTag('name', 'twitter:description', metaDesc);

  // Schema.org Structured Data (Book schema)
  injectSchemaOrgBook(book);
}

function updateMetaTag(attrName, attrVal, content) {
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function injectSchemaOrgBook(book) {
  // Remove existing dynamic schema
  const existing = document.getElementById('schema-book-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = 'schema-book-jsonld';
  script.type = 'application/ld+json';

  const canonicalUrl = `https://rajpublication.com/book.html?id=${encodeURIComponent(book.id)}`;
  const frontImg = book.images?.front || (book.gallery ? book.gallery[0].url : '') || 'https://rajpublication.com/assets/images/hero-banner.svg';
  const isAvail = Boolean(book.price && book.price > 0 && book.inStock !== false);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["Book", "Product"],
    "name": book.title,
    "alternateName": book.titleEn || book.title,
    "url": canonicalUrl,
    "image": frontImg,
    "description": book.fullDescription || book.shortDescription || `${book.title} - Raj Publication தமிழ் போட்டித் தேர்வு புத்தகம்`,
    "isbn": book.isbn || "9788196596538",
    "numberOfPages": book.pages || 450,
    "inLanguage": "ta",
    "bookFormat": "https://schema.org/Paperback",
    "author": {
      "@type": "Person",
      "name": book.author || "Raj Publication வல்லுநர் குழு",
      "alternateName": book.authorEn || "Raj Publication Editorial Board"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Raj Publication",
      "logo": "https://rajpublication.com/assets/images/logo.svg",
      "url": "https://rajpublication.com/"
    },
    "brand": {
      "@type": "Brand",
      "name": "Raj Publication"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "INR",
      "price": book.price || 0,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": isAvail ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "seller": {
        "@type": "Organization",
        "name": "Raj Publication",
        "telephone": "+918148966638"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(book.rating || "4.8"),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": String(book.reviewCount || "48")
    }
  };

  script.textContent = JSON.stringify(schemaData, null, 2);
  document.head.appendChild(script);
}

// Render DOM elements for the single book
function renderBookDetails(book) {
  // Breadcrumb
  const bcActive = document.getElementById('bc-book-title');
  if (bcActive) bcActive.textContent = book.title;

  // Category & Titles
  const catBadge = document.getElementById('book-cat-badge');
  if (catBadge) catBadge.textContent = book.categoryName || 'நூல்';

  const titleEl = document.getElementById('book-title');
  if (titleEl) titleEl.textContent = book.title;

  const titleEnEl = document.getElementById('book-title-en');
  if (titleEnEl) titleEnEl.textContent = book.titleEn || '';

  const authorEl = document.getElementById('book-author');
  if (authorEl) authorEl.textContent = `${book.author} (${book.authorEn || ''})`;

  const isAvailable = Boolean(book.price && book.price > 0);

  // Price & Savings
  const currentPriceEl = document.getElementById('book-price-current');
  if (currentPriceEl) {
    if (isAvailable) {
      currentPriceEl.textContent = `₹${book.price}`;
      currentPriceEl.style.fontSize = '';
      currentPriceEl.style.color = '';
    } else {
      currentPriceEl.textContent = `விலை விரைவில் (Coming Soon)`;
      currentPriceEl.style.fontSize = '1.3rem';
      currentPriceEl.style.color = 'var(--text-muted)';
    }
  }

  const mrpEl = document.getElementById('book-price-mrp');
  if (mrpEl) mrpEl.textContent = (isAvailable && book.originalPrice) ? `₹${book.originalPrice}` : '';

  const discountEl = document.getElementById('book-discount-tag');
  if (discountEl) {
    if (isAvailable && book.discountPercent) {
      discountEl.textContent = `${book.discountPercent}% OFF`;
      discountEl.style.display = 'inline-block';
    } else {
      discountEl.style.display = 'none';
    }
  }

  // Stock Status
  const stockEl = document.querySelector('.price-stock-status');
  if (stockEl) {
    if (isAvailable) {
      stockEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>இருப்பில் உள்ளது (In Stock) — உடனடி டெலிவரிக்கு தயார்</span>
      `;
      stockEl.style.color = 'var(--success)';
    } else {
      stockEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>தற்போது இருப்பில் இல்லை (Currently Unavailable / Coming Soon)</span>
      `;
      stockEl.style.color = '#DC2626';
    }
  }

  // WhatsApp Order Button in Detail Page
  const buyBtn = document.getElementById('btn-book-order-wa');
  if (buyBtn) {
    if (isAvailable) {
      buyBtn.disabled = false;
      buyBtn.style.opacity = '1';
      buyBtn.style.cursor = 'pointer';
      buyBtn.style.background = '';
      buyBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
        <span>Order via WhatsApp &rarr;</span>
      `;
      buyBtn.onclick = () => {
        if (window.openWhatsAppOrderModal) {
          window.openWhatsAppOrderModal(book, 1);
        }
      };
    } else {
      buyBtn.disabled = true;
      buyBtn.style.opacity = '0.5';
      buyBtn.style.cursor = 'not-allowed';
      buyBtn.style.background = '#94A3B8';
      buyBtn.innerHTML = `
        <span>Unavailable / Coming Soon</span>
      `;
      buyBtn.onclick = null;
    }
  }

  // Direct WhatsApp Quick Ask Button
  const askBtn = document.getElementById('btn-book-ask-wa');
  if (askBtn) {
    const config = window.getStoreConfig ? window.getStoreConfig() : {};
    const num = config.whatsappNumber || '918148966638';
    const msg = encodeURIComponent(`வணக்கம்! நான் "${book.title}" புத்தகம் பற்றி சில விவரங்களை கேட்க விரும்புகிறேன்.`);
    askBtn.href = `https://wa.me/${num}?text=${msg}`;
  }

}

// Setup the 3-Image Interactive Gallery (Front, Back, Inside Page)
function setupGallery(book) {
  const galleryItems = book.gallery || [
    { url: book.images.front, title: 'முன் அட்டை / Front Cover', description: 'புத்தகத்தின் முகப்பு அட்டை வடிவமைப்பு' },
    { url: book.images.back, title: 'பின் அட்டை / Back Cover', description: 'நூல் அறிமுகம், மதிப்புரை மற்றும் விலை குறிப்பு' },
    { url: book.images.inside, title: 'உள் பக்கம் / Sample Inside Page', description: 'வாசிப்பு மாதிரி அச்சுப் பக்கம்' }
  ];

  currentImageIndex = 0;

  // Render 3 Thumbnails
  const thumbsWrap = document.getElementById('gallery-thumbs-row');
  if (thumbsWrap) {
    thumbsWrap.innerHTML = galleryItems.map((item, idx) => `
      <div class="gallery-thumb-card ${idx === 0 ? 'active' : ''}" onclick="window.selectGalleryImage(${idx})">
        <img src="${item.url}" alt="${item.title}" onerror="this.onerror=null; this.src='${book.images?.fallback || 'assets/images/books/book-placeholder.svg'}';">
        <span class="thumb-label">${item.title.split('/')[0]}</span>
      </div>
    `).join('');
  }

  // Slide navigation arrows
  const prevBtn = document.getElementById('gallery-slide-prev');
  const nextBtn = document.getElementById('gallery-slide-next');
  if (prevBtn) prevBtn.onclick = () => window.selectGalleryImage(currentImageIndex - 1);
  if (nextBtn) nextBtn.onclick = () => window.selectGalleryImage(currentImageIndex + 1);

  updateFeaturedImage();
}

window.selectGalleryImage = function(index) {
  if (!currentBook) return;
  const galleryItems = currentBook.gallery || [
    { url: currentBook.images.front, title: 'முன் அட்டை' },
    { url: currentBook.images.back, title: 'பின் அட்டை' },
    { url: currentBook.images.inside, title: 'உள் பக்கம்' }
  ];

  if (index < 0) index = galleryItems.length - 1;
  if (index >= galleryItems.length) index = 0;

  currentImageIndex = index;
  updateFeaturedImage();
};

function updateFeaturedImage() {
  if (!currentBook) return;
  const galleryItems = currentBook.gallery || [
    { url: currentBook.images.front, title: 'முன் அட்டை / Front Cover', description: 'புத்தகத்தின் முகப்பு அட்டை' },
    { url: currentBook.images.back, title: 'பின் அட்டை / Back Cover', description: 'பின்னட்டை மற்றும் விலை' },
    { url: currentBook.images.inside, title: 'உள் பக்கம் / Sample Inside Page', description: 'உள் பக்க அச்சு மாதிரி' }
  ];

  const currentItem = galleryItems[currentImageIndex];
  const featuredImg = document.getElementById('gallery-featured-img');
  const captionEl = document.getElementById('gallery-active-caption');

  if (featuredImg) {
    featuredImg.src = currentItem.url;
    featuredImg.alt = `${currentBook.title} - ${currentItem.title}`;
    featuredImg.onerror = function() {
      this.onerror = null;
      this.src = currentBook.images?.fallback || 'assets/images/books/book-placeholder.svg';
    };
  }

  if (captionEl) {
    captionEl.innerHTML = `<strong>${currentItem.title}</strong> — ${currentItem.description || ''}`;
  }

  // Update active state in thumbnail cards
  const thumbCards = document.querySelectorAll('.gallery-thumb-card');
  thumbCards.forEach((c, idx) => {
    c.classList.toggle('active', idx === currentImageIndex);
  });
}

// Tabs Handler
function initTabs() {
  const tabBtns = document.querySelectorAll('.book-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const pane = document.getElementById(`tab-${target}`);
      if (pane) pane.classList.add('active');
    });
  });
}

// Fullscreen Lightbox Zoom Modal
function initLightbox() {
  const featuredImg = document.getElementById('gallery-featured-img');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (featuredImg && lightboxModal && lightboxImg) {
    featuredImg.addEventListener('click', () => {
      lightboxImg.src = featuredImg.src;
      lightboxModal.classList.add('active');
    });
  }

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }
}

// Render Related Books from the same category
function renderRelatedBooks(book) {
  const container = document.getElementById('related-books-grid');
  if (!container) return;

  const related = allCatalogBooks
    .filter(b => b.id !== book.id && (b.category === book.category || b.featured))
    .slice(0, 4);

  if (related.length === 0) {
    const parentSection = document.getElementById('related-books-section');
    if (parentSection) parentSection.style.display = 'none';
    return;
  }

  container.innerHTML = related.map(rel => `
    <article class="book-card" onclick="window.location.href='book.html?id=${rel.id}'" style="cursor:pointer;">
      <div class="book-cover-wrap">
        <img class="book-cover-img" src="${rel.images?.front || rel.gallery[0].url}" alt="${rel.title}" loading="lazy">
        ${rel.discountPercent ? `<span class="book-badge discount">${rel.discountPercent}% OFF</span>` : ''}
      </div>
      <div class="book-body">
        <h4 class="book-title" style="font-size:1rem;height:2.6em;">${rel.title}</h4>
        <div class="book-author" style="font-size:0.82rem;">${rel.author}</div>
        <div class="book-price-box" style="margin-top:auto;">
          <span class="price-current" style="font-size:1.15rem;">₹${rel.price}</span>
          ${rel.originalPrice ? `<span class="price-original" style="font-size:0.82rem;">₹${rel.originalPrice}</span>` : ''}
        </div>
      </div>
    </article>
  `).join('');
}

function showBookNotFound() {
  const mainSec = document.getElementById('book-detail-main');
  if (mainSec) {
    mainSec.innerHTML = `
      <div class="container" style="text-align:center;padding:80px 20px;">
        <h2 style="color:var(--primary);margin-bottom:12px;">புத்தகம் கிடைக்கவில்லை (Book Not Found)</h2>
        <p style="color:var(--text-secondary);margin-bottom:24px;">நீங்கள் தேடும் புத்தகம் பட்டியலில் இல்லை அல்லது நீக்கப்பட்டிருக்கலாம்.</p>
        <a href="index.html" class="btn-primary">அனைத்து புத்தகங்களையும் பார்க்க</a>
      </div>
    `;
  }
}
