const fs = require('fs');
const path = require('path');

const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'books.json'), 'utf8'));
const today = new Date().toISOString().split('T')[0];

console.log(`Generating 100% Perfect SEO for ${books.length} books...`);

// 1. Build sitemap.xml with Google Image Extension
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>https://rajpublication.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://rajpublication.com/assets/images/hero-banner.svg</image:loc>
      <image:title>Raj Publication - தமிழ்நாடு அரசுப் போட்டித் தேர்வு புத்தகங்கள்</image:title>
      <image:caption>காவலர் தமிழ், TNTET, TNPSC மற்றும் பள்ளிப் புத்தகங்கள்</image:caption>
    </image:image>
  </url>
  <!-- Book Detail Shell -->
  <url>
    <loc>https://rajpublication.com/book.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

// Add every single book to sitemap.xml
books.forEach((book, index) => {
  const bookUrl = `https://rajpublication.com/book.html?id=${encodeURIComponent(book.id)}`;
  const priority = (book.featured || index < 10) ? '0.9' : '0.8';
  const imgUrl = (book.images && book.images.front) ? book.images.front.replace(/&/g, '&amp;') : 'https://rajpublication.com/assets/images/logo.svg';
  const cleanTitle = (book.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cleanCategory = (book.categoryName || '').replace(/&/g, '&amp;');

  sitemapXml += `  <url>
    <loc>${bookUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle} | Raj Publication</image:title>
      <image:caption>${cleanCategory}</image:caption>
    </image:image>
  </url>
`;
});

sitemapXml += `</urlset>\n`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml, 'utf8');
console.log('sitemap.xml generated successfully.');

// 2. Build plain text sitemap.txt
let sitemapTxt = `https://rajpublication.com/\nhttps://rajpublication.com/book.html\n`;
books.forEach(book => {
  sitemapTxt += `https://rajpublication.com/book.html?id=${encodeURIComponent(book.id)}\n`;
});
fs.writeFileSync(path.join(__dirname, 'sitemap.txt'), sitemapTxt, 'utf8');
console.log('sitemap.txt generated successfully.');

// 3. Ensure robots.txt is complete
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://rajpublication.com/sitemap.xml
Sitemap: https://rajpublication.com/sitemap.txt
`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsTxt, 'utf8');
console.log('robots.txt updated successfully.');

// 4. Build Schema.org ItemList JSON-LD and update index.html
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Raj Publication Books Catalog",
  "description": "தமிழ்நாடு போட்டித் தேர்வுக்கான பிரத்யேக நூல்கள் பட்டியல்",
  "numberOfItems": books.length,
  "itemListElement": books.map((book, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "url": `https://rajpublication.com/book.html?id=${encodeURIComponent(book.id)}`,
    "name": book.title,
    "image": book.images?.front || 'https://rajpublication.com/assets/images/logo.svg',
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": book.price || 0,
      "availability": (book.price && book.price > 0) ? "https://schema.org/InStock" : "https://schema.org/PreOrder"
    }
  }))
};

let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Replace or insert ItemList schema
const itemListScript = `\n  <!-- Schema.org ItemList for Google Carousel & Search Ranking -->\n  <script type="application/ld+json" id="schema-itemlist">\n${JSON.stringify(itemListSchema, null, 2)}\n  </script>`;

if (indexHtml.includes('id="schema-itemlist"')) {
  indexHtml = indexHtml.replace(/<script type="application\/ld\+json" id="schema-itemlist">[\s\S]*?<\/script>/, itemListScript.trim());
} else {
  indexHtml = indexHtml.replace('</head>', `${itemListScript}\n</head>`);
}

// 5. Add SEO HTML Directory of books before </main> for 100% crawler crawlability
let bookLinksHtml = `\n    <!-- SEO Search Engine Semantic Crawl Directory -->\n    <section class="seo-crawler-index" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;" aria-hidden="true">\n      <h2>Raj Publication Complete Books Directory</h2>\n      <ul>\n`;
books.forEach(book => {
  bookLinksHtml += `        <li><a href="book.html?id=${encodeURIComponent(book.id)}">${book.title} - ${book.author} (${book.categoryName || 'Tamil Books'}) - ₹${book.price || 'Coming Soon'}</a></li>\n`;
});
bookLinksHtml += `      </ul>\n    </section>\n`;

if (indexHtml.includes('class="seo-crawler-index"')) {
  indexHtml = indexHtml.replace(/<!-- SEO Search Engine Semantic Crawl Directory -->[\s\S]*?<\/section>/, bookLinksHtml.trim());
} else {
  indexHtml = indexHtml.replace('</main>', `${bookLinksHtml}  </main>`);
}

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');
console.log('index.html updated with 59-book ItemList schema and crawl directory successfully.');
