/**
 * RAJ PUBLICATION — DIRECT WHATSAPP ORDER DISPATCH SYSTEM
 * Formats complete courier parcel address and order details directly into WhatsApp
 * No client-side PDF downloads or broken popups required
 */

let currentOrderBook = null;
let currentOrderQty = 1;
let lastGeneratedOrder = null;

// Load saved customer address from localStorage
function getSavedCustomer() {
  try {
    const raw = localStorage.getItem('raj_publication_customer');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Save customer address to localStorage
function saveCustomerInfo(info) {
  try {
    localStorage.setItem('raj_publication_customer', JSON.stringify(info));
  } catch (e) {
    console.warn('Could not save customer info:', e);
  }
}

// Open Order Modal for a single book
function openWhatsAppOrderModal(book, initialQty = 1) {
  currentOrderBook = book;
  currentOrderQty = initialQty;

  const modal = document.getElementById('whatsapp-order-modal');
  if (!modal) return;

  // Set book details in modal summary
  const thumbEl = document.getElementById('order-summary-thumb');
  const titleEl = document.getElementById('order-summary-title');
  const priceEl = document.getElementById('order-summary-price');
  const qtyEl = document.getElementById('order-summary-qty');

  const frontImg = book.images?.front || (book.gallery && book.gallery[0] ? book.gallery[0].url : 'assets/images/books/book-placeholder.svg');
  if (thumbEl) thumbEl.src = frontImg;
  if (thumbEl) thumbEl.alt = book.title;
  if (titleEl) titleEl.textContent = book.title;
  if (priceEl) priceEl.textContent = `₹${book.price}`;
  if (qtyEl) qtyEl.textContent = currentOrderQty;

  updateOrderModalTotal();

  // Populate form with saved data if available
  const saved = getSavedCustomer();
  if (saved) {
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const addressInput = document.getElementById('cust-address');
    const landmarkInput = document.getElementById('cust-landmark');
    const cityInput = document.getElementById('cust-city');
    const pincodeInput = document.getElementById('cust-pincode');

    if (nameInput && saved.name) nameInput.value = saved.name;
    if (phoneInput && saved.phone) phoneInput.value = saved.phone;
    if (addressInput && saved.address) addressInput.value = saved.address;
    if (landmarkInput && saved.landmark) landmarkInput.value = saved.landmark;
    if (cityInput && saved.city) cityInput.value = saved.city;
    if (pincodeInput && saved.pincode) pincodeInput.value = saved.pincode;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWhatsAppOrderModal() {
  const modal = document.getElementById('whatsapp-order-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function adjustOrderQty(delta) {
  currentOrderQty = Math.max(1, currentOrderQty + delta);
  const qtyEl = document.getElementById('order-summary-qty');
  if (qtyEl) qtyEl.textContent = currentOrderQty;
  updateOrderModalTotal();
}

function updateOrderModalTotal() {
  if (!currentOrderBook) return;
  const config = window.getStoreConfig ? window.getStoreConfig() : {};
  const subtotal = currentOrderBook.price * currentOrderQty;
  const threshold = config.freeDeliveryThreshold || 499;
  const delivery = subtotal >= threshold ? 0 : (config.deliveryCharge || 40);
  const total = subtotal + delivery;

  const totalEl = document.getElementById('order-total-amount');
  const deliveryEl = document.getElementById('order-delivery-note');

  if (totalEl) totalEl.textContent = `₹${total}`;
  if (deliveryEl) {
    if (delivery === 0) {
      deliveryEl.innerHTML = '<span style="color:var(--success);font-weight:700;">இலவச டெலிவரி (Free Home Delivery)</span>';
    } else {
      deliveryEl.innerHTML = `டெலிவரி கட்டணம்: ₹${delivery} (₹${threshold}க்கு மேல் இலவசம்)`;
    }
  }
}

// Generate unique order ID
function generateOrderId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RP-${dateStr}-${rand}`;
}

// Generate direct view/print Parcel Bill URL
function generateBillUrl(order) {
  try {
    const compactOrder = {
      id: order.orderId,
      d: order.dateStr,
      b: {
        t: order.book.title,
        p: order.book.price,
        s: order.book.sku || order.book.isbn || ('RAJ-' + order.book.sNo),
        pg: order.book.pages || null
      },
      q: order.qty,
      st: order.subtotal,
      del: order.delivery,
      tot: order.total,
      c: {
        n: order.customer.name,
        p: order.customer.phone,
        a: order.customer.address,
        l: order.customer.landmark || '',
        ct: order.customer.city,
        pin: order.customer.pincode,
        m: order.customer.paymentMode,
        nt: order.customer.notes || ''
      }
    };
    const jsonStr = JSON.stringify(compactOrder);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    
    // In production, prefer live domain rajpublication.com
    const origin = (window.location.hostname && window.location.hostname.includes('rajpublication.com'))
      ? 'https://rajpublication.com'
      : (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, ''));

    return `${origin}/bill.html?o=${encoded}`;
  } catch (err) {
    console.error('Error generating bill URL:', err);
    return 'https://rajpublication.com/bill.html';
  }
}

// Open WhatsApp with Short & Sweet Parcel Delivery Slip format and direct PDF Bill link
function openWhatsAppWithMessage(order) {
  const config = window.getStoreConfig ? window.getStoreConfig() : {};
  const targetNumber = config.whatsappNumber || '919876543210';
  const { book, qty, customer, subtotal, delivery, total, orderId, dateStr } = order;
  const billUrl = generateBillUrl(order);

  const lines = [
    `📦 *RAJ PUBLICATION — பார்சல் டெலிவரி ஸ்லிப்*`,
    `══════════════════════════════`,
    `🧾 *ஆர்டர் எண்:* #${orderId}`,
    `📅 *தேதி:* ${dateStr}`,
    ``,
    `📍 *TO: பெறுநர் பார்சல் முகவரி (DELIVERY SLIP):*`,
    `┌─────────────────────────────┐`,
    `  *பெயர்:* ${customer.name}`,
    `  *மொபைல்:* ${customer.phone}`,
    `  *முகவரி:* ${customer.address}`,
    customer.landmark && customer.landmark !== '-' ? `  *அடையாளம்:* ${customer.landmark}` : null,
    `  *ஊர் & மாவட்டம்:* ${customer.city}`,
    `  *பின்கோடு:* *${customer.pincode}*`,
    `└─────────────────────────────┘`,
    ``,
    `📖 *புத்தக விபரம்:*`,
    `• ${book.title}`,
    `• எண்ணிக்கை: ${qty} | விலை: ₹${book.price}`,
    `• டெலிவரி: ${delivery === 0 ? 'இலவசம் (FREE)' : '₹' + delivery}`,
    `💰 *மொத்தத் தொகை:* *₹${total}*`,
    `💳 *பணம் செலுத்தும் முறை:* ${customer.paymentMode}`,
    customer.notes && customer.notes !== 'இல்லை (None)' ? `📝 *குறிப்பு:* ${customer.notes}` : null,
    ``,
    `🖨️ *பார்சல் ஸ்லிப் & PDF பில் லிங்க் (Click to View/Print PDF):*`,
    `${billUrl}`,
    `══════════════════════════════`,
    `📦 *தயவுசெய்து எனது முகவரிக்கு பார்சல் அனுப்பி வைக்கவும்.*`
  ].filter(line => line !== null);

  const fullMessage = lines.join('\n');
  const encodedMsg = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

  // On mobile browsers, direct location.href opens the WhatsApp app immediately without popup blocking
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = whatsappUrl;
  } else {
    window.open(whatsappUrl, '_blank');
  }
}

// Main Submit Order Handler
function handleOrderFormSubmit(e) {
  e.preventDefault();

  if (!currentOrderBook) {
    alert('புத்தகம் தேர்ந்தெடுக்கப்படவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.');
    return;
  }

  const name = document.getElementById('cust-name')?.value.trim();
  const phone = document.getElementById('cust-phone')?.value.trim();
  const address = document.getElementById('cust-address')?.value.trim();
  const landmark = document.getElementById('cust-landmark')?.value.trim() || '-';
  const city = document.getElementById('cust-city')?.value.trim();
  const pincode = document.getElementById('cust-pincode')?.value.trim();
  const notes = document.getElementById('cust-notes')?.value.trim() || 'இல்லை (None)';

  const paymentEl = document.querySelector('input[name="payment_mode"]:checked');
  const paymentMode = paymentEl ? paymentEl.value : 'UPI / GPay / PhonePe';

  // Form validation
  if (!name || !phone || !address || !city || !pincode) {
    showToast('தயவுசெய்து கட்டாய விவரங்கள் அனைத்தையும் நிரப்பவும் (Please fill all required fields)');
    return;
  }

  // Save to localStorage for customer convenience next time
  saveCustomerInfo({ name, phone, address, landmark, city, pincode });

  const config = window.getStoreConfig ? window.getStoreConfig() : {};
  const subtotal = currentOrderBook.price * currentOrderQty;
  const threshold = config.freeDeliveryThreshold || 499;
  const delivery = subtotal >= threshold ? 0 : (config.deliveryCharge || 40);
  const total = subtotal + delivery;
  const orderId = generateOrderId();
  const dateStr = new Date().toLocaleString('ta-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const orderData = {
    orderId,
    dateStr,
    book: currentOrderBook,
    qty: currentOrderQty,
    subtotal,
    delivery,
    total,
    customer: {
      name,
      phone,
      address,
      landmark,
      city,
      pincode,
      notes,
      paymentMode
    }
  };

  lastGeneratedOrder = orderData;

  // Close modal immediately
  closeWhatsAppOrderModal();

  showToast('வாட்ஸ்அப் திறக்கப்படுகிறது... உங்கள் ஆர்டர் பதிவு செய்யப்படுகிறது...');

  // Directly open WhatsApp without delay or failed download attempts
  openWhatsAppWithMessage(orderData);
}

// No-op stubs in case existing scripts reference them
function showInvoiceSuccessModal() {}
function closeInvoiceSuccessModal() {}

// Toast helper
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>📦</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Attach event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('whatsapp-order-form');
  if (form) {
    form.addEventListener('submit', handleOrderFormSubmit);
  }

  // Modal backdrop click to close
  const modal = document.getElementById('whatsapp-order-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeWhatsAppOrderModal();
    });
  }

  // Close button
  const closeBtn = document.getElementById('close-order-modal-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeWhatsAppOrderModal);
  }

  // Quantity controls
  const decBtn = document.getElementById('order-qty-dec');
  const incBtn = document.getElementById('order-qty-inc');
  if (decBtn) decBtn.addEventListener('click', () => adjustOrderQty(-1));
  if (incBtn) incBtn.addEventListener('click', () => adjustOrderQty(1));
});

window.openWhatsAppOrderModal = openWhatsAppOrderModal;
window.closeWhatsAppOrderModal = closeWhatsAppOrderModal;
window.showInvoiceSuccessModal = showInvoiceSuccessModal;
window.closeInvoiceSuccessModal = closeInvoiceSuccessModal;
window.showToast = showToast;
