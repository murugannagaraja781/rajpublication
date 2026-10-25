/**
 * RAJ PUBLICATION — WHATSAPP ORDER & BILL/INVOICE PDF GENERATOR
 * Generates official Bill Book format Tax Invoice & Courier Dispatch Slip
 * Automatically generates & downloads PDF via html2pdf and forwards to WhatsApp
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

// Generate Bill Book Invoice HTML for PDF & Printing
function buildInvoiceHTML(order) {
  const { book, qty, customer, subtotal, delivery, total, orderId, dateStr } = order;

  return `
    <div id="raj-bill-content" style="font-family:'Noto Sans Tamil', 'Plus Jakarta Sans', Arial, sans-serif; background:#FFFFFF; color:#0F172A; padding:24px; max-width:800px; margin:0 auto; border:1px solid #CBD5E1; box-sizing:border-box;">
      <!-- Invoice Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #1E3A8A; padding-bottom:14px; margin-bottom:16px;">
        <div>
          <div style="font-size:26px; font-weight:900; color:#1E3A8A; letter-spacing:1px; line-height:1.1;">RAJ PUBLICATION</div>
          <div style="font-size:12px; font-weight:700; color:#B45309; margin-top:3px;">ராஜ் பப்ளிகேஷன் • அரசுப் போட்டித் தேர்வு வெளியீட்டகம்</div>
          <div style="font-size:11px; color:#475569; margin-top:4px;">No. 12, Book Sellers Lane, Triplicane, Chennai - 600005, Tamil Nadu</div>
          <div style="font-size:11px; color:#475569;">WhatsApp: +91 98765 43210 | Web: rajpublication.com</div>
        </div>
        <div style="text-align:right;">
          <div style="display:inline-block; background:#1E3A8A; color:#FFFFFF; padding:4px 12px; border-radius:4px; font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">
            TAX INVOICE / CASH BILL
          </div>
          <div style="font-size:11px; color:#64748B; margin-top:4px;">வரி ரசீது &amp; பார்சல் விநியோகத் தாள்</div>
          <div style="font-size:13px; font-weight:800; color:#0F172A; margin-top:6px;">Invoice No: <span style="color:#1E3A8A;">#${orderId}</span></div>
          <div style="font-size:11px; color:#64748B;">Date: ${dateStr}</div>
        </div>
      </div>

      <!-- PARCEL DISPATCH SLIP (CUT & PASTE ON COURIER/PARCEL) -->
      <div style="border:2px dashed #1E3A8A; background:#F8FAFC; padding:14px 16px; border-radius:8px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #CBD5E1; padding-bottom:6px; margin-bottom:10px;">
          <span style="font-size:12px; font-weight:800; color:#1E3A8A; text-transform:uppercase; letter-spacing:0.5px;">
            📦 PARCEL DISPATCH LABEL / பார்சல் ஒட்டுவதற்கான முகவரிக் குறிப்பு (Cut &amp; Paste on Envelope)
          </span>
          <span style="font-size:10px; background:#0284C7; color:#FFFFFF; padding:2px 8px; border-radius:3px; font-weight:700;">SPEED POST / PARCEL</span>
        </div>
        <div style="display:grid; grid-template-columns:1.6fr 1fr; gap:16px;">
          <div>
            <div style="font-size:11px; color:#64748B; font-weight:700; text-transform:uppercase;">TO (பெறுநர்):</div>
            <div style="font-size:16px; font-weight:900; color:#0F172A; margin:2px 0;">${customer.name}</div>
            <div style="font-size:13px; color:#334155; line-height:1.45;">${customer.address}</div>
            <div style="font-size:13px; color:#334155;">${customer.landmark && customer.landmark !== '-' ? 'Landmark: ' + customer.landmark + ', ' : ''}${customer.city}</div>
            <div style="font-size:15px; font-weight:900; color:#0F172A; margin-top:6px; letter-spacing:1px;">
              PINCODE: <span style="background:#FEF08A; padding:2px 10px; border:1.5px solid #EAB308; border-radius:4px; color:#854D0E;">${customer.pincode}</span>
            </div>
            <div style="font-size:13px; font-weight:800; color:#0F172A; margin-top:6px;">
              Mobile / WhatsApp: <span style="color:#1E3A8A;">${customer.phone}</span>
            </div>
          </div>
          <div style="border-left:1px dashed #CBD5E1; padding-left:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:10px; color:#64748B; font-weight:700; text-transform:uppercase;">FROM (அனுப்புநர்):</div>
              <div style="font-size:13px; font-weight:900; color:#1E3A8A; margin-top:2px;">RAJ PUBLICATION</div>
              <div style="font-size:11px; color:#475569; line-height:1.4;">No. 12, Book Sellers Lane, Triplicane</div>
              <div style="font-size:11px; color:#475569;">Chennai, Tamil Nadu - 600005</div>
              <div style="font-size:11px; font-weight:800; color:#0F172A; margin-top:4px;">Helpline: +91 98765 43210</div>
            </div>
            <div style="font-size:10px; color:#64748B; font-style:italic; border-top:1px dotted #CBD5E1; padding-top:4px;">
              Fragile • Books Inside • Handle with care
            </div>
          </div>
        </div>
      </div>

      <!-- PARTICULARS TABLE -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:12px;">
        <thead>
          <tr style="background:#1E3A8A; color:#FFFFFF;">
            <th style="padding:8px; text-align:center; border:1px solid #1E3A8A; width:36px;">S.No</th>
            <th style="padding:8px; text-align:left; border:1px solid #1E3A8A;">புத்தகத்தின் பெயர் (Book Description)</th>
            <th style="padding:8px; text-align:center; border:1px solid #1E3A8A; width:90px;">SKU / ISBN</th>
            <th style="padding:8px; text-align:center; border:1px solid #1E3A8A; width:45px;">Qty</th>
            <th style="padding:8px; text-align:right; border:1px solid #1E3A8A; width:80px;">MRP (₹)</th>
            <th style="padding:8px; text-align:right; border:1px solid #1E3A8A; width:85px;">விலை (₹)</th>
            <th style="padding:8px; text-align:right; border:1px solid #1E3A8A; width:85px;">மொத்தம் (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:10px; text-align:center; border:1px solid #CBD5E1; font-weight:700;">1</td>
            <td style="padding:10px; border:1px solid #CBD5E1;">
              <div style="font-weight:800; font-size:13px; color:#0F172A;">${book.title}</div>
              <div style="font-size:11px; color:#64748B; margin-top:2px;">${book.categoryName || 'போட்டித் தேர்வு வழிகாட்டி'} • ${book.pages ? book.pages + ' பக்கங்கள்' : 'சமீபத்திய பதிப்பு'}</div>
            </td>
            <td style="padding:10px; text-align:center; border:1px solid #CBD5E1; font-family:monospace; font-size:11px;">${book.sku || book.isbn || ('RAJ-' + book.sNo)}</td>
            <td style="padding:10px; text-align:center; border:1px solid #CBD5E1; font-weight:800; font-size:13px;">${qty}</td>
            <td style="padding:10px; text-align:right; border:1px solid #CBD5E1; text-decoration:line-through; color:#94A3B8;">₹${book.originalPrice || book.price}</td>
            <td style="padding:10px; text-align:right; border:1px solid #CBD5E1; font-weight:700; color:#1E3A8A;">₹${book.price}</td>
            <td style="padding:10px; text-align:right; border:1px solid #CBD5E1; font-weight:900; color:#0F172A; font-size:13px;">₹${book.price * qty}</td>
          </tr>
        </tbody>
      </table>

      <!-- SUMMARY & TOTALS -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px;">
        <div style="max-width:55%;">
          <div style="font-size:11px; color:#64748B; font-weight:700; text-transform:uppercase;">பணம் செலுத்தும் முறை (Payment Method):</div>
          <div style="font-size:13px; font-weight:800; color:#0F172A; margin:2px 0;">${customer.paymentMode}</div>
          <div style="font-size:11px; color:#475569; margin-top:6px; background:#F1F5F9; padding:8px 10px; border-radius:6px; border:1px solid #E2E8F0; line-height:1.4;">
            <strong>டெலிவரி தகவல்:</strong> தமிழ்நாடு முழுவதும் ஸ்பீடு போஸ்ட் / கூரியர் மூலம் 2 முதல் 4 வேலை நாட்களில் பாதுகாப்பாக விநியோகிக்கப்படும்.
          </div>
        </div>
        <div style="width:230px; font-size:13px; background:#F8FAFC; padding:12px; border-radius:6px; border:1px solid #E2E8F0;">
          <div style="display:flex; justify-content:space-between; padding:3px 0;">
            <span style="color:#64748B;">புத்தகத்தின் விலை:</span>
            <span style="font-weight:700;">₹${book.price * qty}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:3px 0; border-bottom:1px solid #CBD5E1;">
            <span style="color:#64748B;">டெலிவரி கட்டணம்:</span>
            <span style="color:#16A34A; font-weight:800;">${delivery === 0 ? 'இலவசம் (FREE)' : '₹' + delivery}</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0 2px; font-size:16px; font-weight:900; color:#1E3A8A;">
            <span>செலுத்த வேண்டிய தொகை:</span>
            <span>₹${total}</span>
          </div>
        </div>
      </div>

      <!-- FOOTER STAMP & SIGNATURE -->
      <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #CBD5E1; padding-top:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <!-- Official Circular Seal -->
          <div style="width:76px; height:76px; border:2px dashed #1E3A8A; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#1E3A8A; font-size:8px; font-weight:900; text-align:center; transform:rotate(-6deg); padding:4px; box-sizing:border-box;">
            <span>RAJ PUBLICATION</span>
            <span style="font-size:7px; color:#16A34A; margin:2px 0;">★ VERIFIED ★</span>
            <span>PACKED &amp; SENT</span>
          </div>
          <div style="font-size:11px; color:#64748B; line-height:1.35;">
            Official Dispatch Invoice<br>
            Raj Publication • Triplicane, Chennai<br>
            <span style="font-size:10px; color:#94A3B8;">Computer generated bill • Valid without physical signature</span>
          </div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:'Courier New', monospace; font-size:14px; font-weight:800; color:#1E3A8A;">Raj Publication</div>
          <div style="font-size:11px; color:#475569; border-top:1px solid #475569; width:150px; padding-top:4px; margin-top:2px;">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  `;
}

// Generate & Download PDF using html2pdf.js
async function generateAndDownloadInvoicePDF(order) {
  const container = document.createElement('div');
  container.id = 'temp-invoice-generator';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.innerHTML = buildInvoiceHTML(order);
  document.body.appendChild(container);

  const filename = `RajPublication_Bill_${order.orderId}.pdf`;

  if (window.html2pdf) {
    try {
      const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().from(container.firstElementChild).set(opt).save();
      console.log('Invoice PDF generated and downloaded:', filename);
    } catch (err) {
      console.error('Error generating PDF with html2pdf:', err);
    } finally {
      document.body.removeChild(container);
    }
  } else {
    console.warn('html2pdf library not loaded, using window.print fallback');
    document.body.removeChild(container);
  }
}

// Show the Success & Print Modal
function showInvoiceSuccessModal(order) {
  let modal = document.getElementById('invoice-success-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'invoice-success-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog" style="max-width:680px; padding:28px;">
        <button type="button" class="modal-close-btn" onclick="window.closeInvoiceSuccessModal()">&times;</button>
        <div style="text-align:center; margin-bottom:20px;">
          <div style="font-size:42px; margin-bottom:8px;">🧾</div>
          <h2 style="font-size:22px; color:#1E3A8A; font-weight:900; margin-bottom:6px;">
            உங்கள் பில் (PDF Bill) தயாராகிவிட்டது!
          </h2>
          <p style="font-size:14px; color:#475569; line-height:1.5;">
            பில் PDF உங்கள் சாதனத்தில் டவுன்லோட் செய்யப்பட்டுள்ளது. கீழே உள்ள பொத்தானை அழுத்தி <strong>வாட்ஸ்அப்பில் பில்லை இணைத்து அனுப்பவும்</strong>.
          </p>
        </div>

        <div id="invoice-modal-bill-preview" style="max-height:360px; overflow-y:auto; border:1px solid #CBD5E1; border-radius:8px; margin-bottom:20px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.05);">
          <!-- Live Bill Preview -->
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
          <button type="button" id="btn-print-invoice" class="btn-primary" style="background:#1E3A8A; display:flex; align-items:center; justify-content:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>🖨️ பிரிண்ட் செய்க (Print Slip)</span>
          </button>
          
          <button type="button" id="btn-redownload-pdf" class="btn-primary" style="background:#0284C7; display:flex; align-items:center; justify-content:center; gap:8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>⬇️ மீண்டும் PDF பெற</span>
          </button>
        </div>

        <button type="button" id="btn-open-wa-with-bill" class="btn-primary" style="background:#25D366; width:100%; font-size:16px; padding:14px; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:0 4px 14px rgba(37,211,102,0.4);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
          <span>📲 வாட்ஸ்அப்பில் பில்லை இணைத்து அனுப்பவும்</span>
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const previewWrap = document.getElementById('invoice-modal-bill-preview');
  if (previewWrap) {
    previewWrap.innerHTML = buildInvoiceHTML(order);
  }

  // Print Button Handler
  const printBtn = document.getElementById('btn-print-invoice');
  if (printBtn) {
    printBtn.onclick = () => {
      const printWin = window.open('', '_blank');
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Raj Publication - Invoice #${order.orderId}</title>
          <style>
            @page { size: A4; margin: 8mm; }
            body { margin:0; font-family:sans-serif; }
          </style>
        </head>
        <body>
          ${buildInvoiceHTML(order)}
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    };
  }

  // Redownload PDF Button
  const dlBtn = document.getElementById('btn-redownload-pdf');
  if (dlBtn) {
    dlBtn.onclick = () => generateAndDownloadInvoicePDF(order);
  }

  // WhatsApp Button Handler
  const waBtn = document.getElementById('btn-open-wa-with-bill');
  if (waBtn) {
    waBtn.onclick = () => {
      openWhatsAppWithMessage(order);
      closeInvoiceSuccessModal();
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeInvoiceSuccessModal() {
  const modal = document.getElementById('invoice-success-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Open WhatsApp with complete formatted text
function openWhatsAppWithMessage(order) {
  const config = window.getStoreConfig ? window.getStoreConfig() : {};
  const targetNumber = config.whatsappNumber || '919876543210';
  const { book, qty, customer, subtotal, delivery, total, orderId, dateStr } = order;

  const lines = [
    `*📦 RAJ PUBLICATION — புதிய புத்தக முன்பதிவு & பில்*`,
    `══════════════════════════════`,
    `*🧾 பில் எண் (Invoice No):* #${orderId}`,
    `*📅 தேதி (Date):* ${dateStr}`,
    ``,
    `*📖 புத்தக விவரம் (Order Details):*`,
    `• *தலைப்பு:* ${book.title}`,
    `• *SKU / பார்கோடு:* ${book.sku || book.isbn || '-' }`,
    `• *பக்கங்கள்:* ${book.pages ? book.pages + ' பக்கங்கள்' : '-'}`,
    `• *விலை:* ₹${book.price} (MRP: ₹${book.originalPrice || book.price})`,
    `• *எண்ணிக்கை (Qty):* ${qty}`,
    `• *டெலிவரி:* ${delivery === 0 ? 'இலவசம் (Free Delivery)' : '₹' + delivery}`,
    `💰 *செலுத்த வேண்டிய மொத்தத் தொகை:* *₹${total}*`,
    ``,
    `*📍 பார்சல் அனுப்ப வேண்டிய முகவரி (Delivery Address):*`,
    `• *பெயர்:* ${customer.name}`,
    `• *மொபைல் / WhatsApp:* ${customer.phone}`,
    `• *முகவரி:* ${customer.address}`,
    `• *அடையாளம்:* ${customer.landmark}`,
    `• *ஊர் & மாவட்டம்:* ${customer.city}`,
    `• *பின்கோடு (Pincode):* *${customer.pincode}*`,
    `• *பணம் செலுத்தும் முறை:* ${customer.paymentMode}`,
    `══════════════════════════════`,
    `*📄 பில் PDF இணைக்கப்பட்டுள்ளது:*`,
    `எனது சாதனத்தில் *RajPublication_Bill_${orderId}.pdf* டவுன்லோட் செய்யப்பட்டுள்ளது. இந்த மெசேஜுடன் அந்த PDF பில்லை இத்துடன் இணைத்து அனுப்பியுள்ளேன். பார்சலில் இந்த முகவரியை ஒட்டி அனுப்பவும்.`,
    `══════════════════════════════`,
    `_Raj Publication அதிகாரப்பூர்வ இணையதளம் மூலம் அனுப்பப்பட்ட நேரடி ஆர்டர்_`
  ];

  const fullMessage = lines.join('\n');
  const encodedMsg = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

  window.open(whatsappUrl, '_blank');
}

// Main Submit Order Handler
async function handleOrderFormSubmit(e) {
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
    showToast('தயவுசெய்து கட்டாய விவரங்கள் அனைத்தையும் நிரப்பவும் (Please fill all required fields)');
    return;
  }

  // Save to localStorage for next time
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

  // Close address modal
  closeWhatsAppOrderModal();

  showToast('🧾 உங்கள் பில் (PDF Bill) தயாராகிறது...');

  // Automatically generate & download the PDF Bill
  await generateAndDownloadInvoicePDF(orderData);

  // Show the Success & Print Modal with 1-click WhatsApp attachment & Print options
  showInvoiceSuccessModal(orderData);
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
  toast.innerHTML = `<span>🧾</span> <span>${message}</span>`;
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
window.closeInvoiceSuccessModal = closeInvoiceSuccessModal;
window.showToast = showToast;
