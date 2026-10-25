# 📖 Raj Publication (ராஜ் பப்ளிகேஷன்)

> **High-Performance, Pure SEO Tamil Bookstore with 3-Image Interactive Gallery & Direct WhatsApp Order System**
> Designed for effortless static hosting on **GitHub Pages**.

![Raj Publication Banner](assets/images/hero-banner.svg)

---

## ✨ Features (சிறப்பம்சங்கள்)

1. **3-Image Interactive Gallery (3 விதமான படங்கள்)**:
   - Front Cover (முன் அட்டை)
   - Back Cover (பின் அட்டை)
   - Sample Inside Page (உள் பக்க முன்னோட்டம்)
   - Interactive thumbnail previews and fullscreen lightbox zoom preview.

2. **Zero-Backend WhatsApp Order Checkout**:
   - Collects customer Name, Phone, Full Address, Landmark, City/District, Pincode, and Payment mode.
   - Automatically saves customer address to `localStorage` for 1-click repeat orders.
   - Generates a beautifully formatted WhatsApp receipt with emojis, order ID, and calculation.
   - Instantly opens WhatsApp on mobile or WhatsApp Web on desktop.

3. **Pure SEO & Google Discover Optimization**:
   - Semantic HTML5 structure (`<article>`, `<time>`, `<section>`, `<nav>`, `<aside>`).
   - Dynamic OpenGraph and Twitter Cards.
   - Schema.org JSON-LD structured data (`Book` and `BookStore` schemas).
   - Dedicated `sitemap.xml` and `robots.txt`.

4. **100% JSON-Driven Catalog**:
   - Add, edit, or delete books easily in `data/books.json` without writing code.
   - Configure WhatsApp phone number and store policies in `data/config.json`.

5. **Instant Live Search & Filters**:
   - Real-time search across book titles (Tamil & English), author, category, and ISBN.
   - Keyboard shortcut: Press `/` anywhere to focus search.
   - Category filtering pills with live book counts.
   - Sort by Featured, Price (Low to High, High to Low), Customer Rating, and Highest Discount.

6. **Ultra-Responsive Aesthetics**:
   - Mobile-first responsive layout with sticky bottom navigation.
   - Floating animated WhatsApp chat button.
   - Fast loading with 0 external framework overhead (pure Vanilla JS and CSS).

---

## 🚀 Quick Start / Local Testing

Because this uses modern client-side `fetch()` to load `data/books.json`, you can run a local HTTP server:

```bash
# Using Python
python -m http.server 8000

# OR using Node npx
npx serve .

# OR simply access via XAMPP Apache:
# http://localhost/rajpublication/
```

Then open `http://localhost:8000` or `http://localhost/rajpublication/` in your browser!

---

## 📂 Project Structure

```text
rajpublication/
├── index.html               # Main storefront with search, catalog & quick view
├── book.html                # Dedicated single book page (3-image gallery & pure SEO)
├── 404.html                 # Fallback 404 page for GitHub Pages
├── robots.txt               # Search engine crawler directives
├── sitemap.xml              # SEO Sitemap
├── README.md                # Documentation
├── css/
│   ├── style.css            # Master stylesheet
│   └── book-detail.css      # Book detail & gallery stylesheet
├── js/
│   ├── config.js            # Store config loader
│   ├── app.js               # Search, filter, grid & quick view logic
│   ├── book-detail.js       # Single book renderer & SEO injector
│   └── whatsapp-order.js    # Address capture modal & WhatsApp message builder
├── data/
│   ├── config.json          # WhatsApp number & store details
│   └── books.json           # Catalog of books (with 3 images each)
├── assets/
│   └── images/
│       ├── logo.svg
│       ├── favicon.svg
│       ├── hero-banner.svg
│       └── books/           # 24 initial book images (front, back, inside)
└── docs/
    └── HOW_TO_ADD_BOOKS.md  # Detailed guide on adding books and deploying
```

---

## 🛠️ Deployment on GitHub Pages

1. Commit and push:
   ```bash
   git add .
   git commit -m "Complete Raj Publication storefront"
   git push origin main
   ```
2. In your GitHub repo:
   - Go to **Settings** &rarr; **Pages**
   - Under **Build and deployment**, select:
     - **Source**: `Deploy from a branch`
     - **Branch**: `main` / `root`
     - Click **Save**
3. Your bookstore will be live in 1-2 minutes at:
   `https://murugannagaraja781.github.io/rajpublication/`

---

## 📞 Support & Contact

- **Raj Publication** — Chennai, Tamil Nadu, India
- **WhatsApp**: +91 98765 43210
- **Email**: rajpublicationbooks@gmail.com
