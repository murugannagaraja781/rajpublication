/**
 * RAJ PUBLICATION — WHATSAPP ORDER CONTROLLER
 * Handles address collection, local storage persistence, and WhatsApp message generation
 */

let currentOrderBook = null;
let currentOrderQty = 1;

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

  if (thumbEl) thumbEl.src = book.images?.front || (Array.isArray(book.images) ? book.images[0] : '');
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
      deliveryEl.innerHTML = '<span style="color:var(--success);font-weight:700;">இலவச டெலிவரி (Free Delivery)</span>';
    } else {
      deliveryEl.innerHTML = `டெலிவரி கட்டணம்: ₹${delivery} (₹${threshold}க்கு மேல் இலவசம்)`;
    }
  }
}

// Generate unique order ID
function generateOrderId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RAJ-${dateStr}-${rand}`;
}

// Submit Order via WhatsApp
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

  // Validation
  if (!name || !phone || !address || !city || !pincode) {
    showToast('தயவுசெய்து கட்டாய விவரங்கள் அனைத்தையும் நிரப்பவும் (Please fill required fields)');
    return;
  }

  // Save to localStorage for next time
  saveCustomerInfo({ name, phone, address, landmark, city, pincode });

  const config = window.getStoreConfig ? window.getStoreConfig() : {};
  const targetNumber = config.whatsappNumber || '919876543210';

  const subtotal = currentOrderBook.price * currentOrderQty;
  const threshold = config.freeDeliveryThreshold || 499;
  const delivery = subtotal >= threshold ? 0 : (config.deliveryCharge || 40);
  const total = subtotal + delivery;
  const orderId = generateOrderId();
  const now = new Date().toLocaleString('ta-IN', { dateStyle: 'medium', timeStyle: 'short' });

  // Format clean WhatsApp message
  const lines = [
    `*📚 RAJ PUBLICATION — புதிய புத்தக முன்பதிவு*`,
    `══════════════════════════════`,
    `*ஆர்டர் எண் (Order ID):* #${orderId}`,
    `*தேதி (Date):* ${now}`,
    ``,
    `📖 *புத்தக விவரங்கள் (Book Details):*`,
    `• *தலைப்பு:* ${currentOrderBook.title}`,
    `• *ஆங்கிலம்:* ${currentOrderBook.titleEn || '-'}`,
    `• *ஆசிரியர்:* ${currentOrderBook.author}`,
    `• *விலை:* ₹${currentOrderBook.price} (MRP: ₹${currentOrderBook.originalPrice})`,
    `• *எண்ணிக்கை (Qty):* ${currentOrderQty}`,
    `• *டெலிவரி கட்டணம்:* ${delivery === 0 ? 'இலவசம் (Free Delivery)' : '₹' + delivery}`,
    `💰 *செலுத்த வேண்டிய மொத்த தொகை:* *₹${total}*`,
    ``,
    `📍 *வாடிக்கையாளர் டெலிவரி முகவரி (Delivery Details):*`,
    `• *பெயர்:* ${name}`,
    `• *மொபைல் / WhatsApp:* ${phone}`,
    `• *முழு முகவரி:* ${address}`,
    `• *அடையாளம் (Landmark):* ${landmark}`,
    `• *ஊர் & மாவட்டம்:* ${city}`,
    `• *பின்கோடு (Pincode):* ${pincode}`,
    `• *பணம் செலுத்தும் முறை:* ${paymentMode}`,
    `• *குறிப்பு:* ${notes}`,
    `══════════════════════════════`,
    `_Raj Publication அதிகாரப்பூர்வ இணையதளம் மூலம் அனுப்பப்பட்ட நேரடி ஆர்டர்_`
  ];

  const fullMessage = lines.join('\n');
  const encodedMsg = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

  // Close modal
  closeWhatsAppOrderModal();

  showToast('வாட்ஸ்அப் செயலி திறக்கப்படுகிறது... (Opening WhatsApp...)');

  // Open WhatsApp in new tab/window
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 400);
}

// Toast helper
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>💬</span> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
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
window.showToast = showToast;
