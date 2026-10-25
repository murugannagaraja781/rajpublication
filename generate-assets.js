const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, 'assets', 'images', 'books');
const imgDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
}

// Store logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  <rect width="320" height="80" rx="12" fill="none" />
  <!-- Book Icon -->
  <g transform="translate(12, 14)">
    <rect x="0" y="2" width="48" height="50" rx="6" fill="url(#goldGrad)" opacity="0.15" />
    <!-- Open Book Vector -->
    <path d="M 24 10 Q 14 6 4 10 L 4 44 Q 14 40 24 44 Z" fill="url(#goldGrad)" />
    <path d="M 24 10 Q 34 6 44 10 L 44 44 Q 34 40 24 44 Z" fill="#FDE68A" />
    <path d="M 24 10 L 24 45" stroke="#B45309" stroke-width="2" stroke-linecap="round" />
    <!-- Quill / Star -->
    <circle cx="24" cy="6" r="3.5" fill="#FBBF24" />
  </g>
  <!-- Text Brand -->
  <text x="70" y="38" font-family="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="0.5">
    RAJ <tspan fill="url(#goldGrad)">PUBLICATION</tspan>
  </text>
  <text x="72" y="58" font-family="'Noto Sans Tamil', -apple-system, sans-serif" font-weight="600" font-size="12" fill="#CBD5E1" letter-spacing="1">
    ராஜ் பப்ளிகேஷன் • BOOKS
  </text>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'logo.svg'), logoSvg);

// Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="favGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="favGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#favGrad)" />
  <rect x="4" y="4" width="56" height="56" rx="10" fill="none" stroke="url(#favGold)" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.6"/>
  <g transform="translate(8, 8)">
    <path d="M 24 10 Q 14 6 4 10 L 4 40 Q 14 36 24 40 Z" fill="url(#favGold)" />
    <path d="M 24 10 Q 34 6 44 10 L 44 40 Q 34 36 24 40 Z" fill="#FDE68A" />
    <path d="M 24 10 L 24 41" stroke="#92400E" stroke-width="2" stroke-linecap="round" />
    <circle cx="24" cy="6" r="3" fill="#FDE68A" />
  </g>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'favicon.svg'), faviconSvg);

// Hero illustration banner SVG
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="50%" stop-color="#312E81" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="book1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4C0519" />
    </linearGradient>
    <linearGradient id="book2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B" />
      <stop offset="100%" stop-color="#022C22" />
    </linearGradient>
    <linearGradient id="book3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#172554" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>
  <rect width="900" height="600" rx="24" fill="url(#heroBg)" />
  <circle cx="750" cy="150" r="220" fill="#4338CA" opacity="0.3" filter="blur(40px)" />
  <circle cx="150" cy="450" r="180" fill="#B45309" opacity="0.15" filter="blur(40px)" />

  <!-- Stack of Books illustration -->
  <!-- Book 1 (Back left) -->
  <g transform="translate(180, 160) rotate(-10)" filter="url(#shadow)">
    <rect width="180" height="260" rx="10" fill="url(#book1)" stroke="#FDE68A" stroke-width="1.5" />
    <rect x="0" y="0" width="22" height="260" rx="6" fill="#000000" opacity="0.2" />
    <line x1="30" y1="40" x2="150" y2="40" stroke="#FDE68A" stroke-width="2" />
    <text x="90" y="110" font-family="'Noto Sans Tamil', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">சிவகாமியின்</text>
    <text x="90" y="134" font-family="'Noto Sans Tamil', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">சபதம்</text>
    <text x="90" y="180" font-family="sans-serif" font-size="12" fill="#FDE68A" text-anchor="middle">கல்கி</text>
  </g>

  <!-- Book 2 (Back right) -->
  <g transform="translate(480, 180) rotate(12)" filter="url(#shadow)">
    <rect width="180" height="250" rx="10" fill="url(#book2)" stroke="#FDE68A" stroke-width="1.5" />
    <rect x="0" y="0" width="22" height="250" rx="6" fill="#000000" opacity="0.2" />
    <line x1="30" y1="40" x2="150" y2="40" stroke="#FDE68A" stroke-width="2" />
    <text x="90" y="110" font-family="'Noto Sans Tamil', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">திருக்குறள்</text>
    <text x="90" y="134" font-family="'Noto Sans Tamil', sans-serif" font-size="13" font-weight="bold" fill="#FDE68A" text-anchor="middle">எளிய உரை</text>
    <text x="90" y="180" font-family="sans-serif" font-size="12" fill="#A7F3D0" text-anchor="middle">திருவள்ளுவர்</text>
  </g>

  <!-- Book 3 (Center Front) -->
  <g transform="translate(320, 110)" filter="url(#shadow)">
    <rect width="230" height="340" rx="12" fill="url(#book3)" stroke="#F59E0B" stroke-width="2.5" />
    <!-- Spine fold -->
    <rect x="0" y="0" width="28" height="340" rx="8" fill="#000000" opacity="0.25" />
    <!-- Borders -->
    <rect x="36" y="20" width="160" height="300" rx="8" fill="none" stroke="url(#gold)" stroke-width="1.5" stroke-dasharray="6 3" />
    <circle cx="116" cy="70" r="26" fill="url(#gold)" opacity="0.2" />
    <polygon points="116,52 122,66 136,66 125,75 129,88 116,79 103,88 107,75 96,66 110,66" fill="url(#gold)" />
    
    <text x="116" y="145" font-family="'Noto Sans Tamil', sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">பொன்னியின்</text>
    <text x="116" y="175" font-family="'Noto Sans Tamil', sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">செல்வன்</text>
    <text x="116" y="210" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#FDE68A" text-anchor="middle" letter-spacing="1.5">PONNIYIN SELVAN</text>
    <line x1="60" y1="230" x2="172" y2="230" stroke="url(#gold)" stroke-width="1.5" />
    <text x="116" y="260" font-family="'Noto Sans Tamil', sans-serif" font-size="15" fill="#E2E8F0" text-anchor="middle">கல்கி</text>
    <rect x="70" y="280" width="92" height="24" rx="12" fill="url(#gold)" />
    <text x="116" y="296" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1E1B4B" text-anchor="middle">BESTSELLER</text>
  </g>

  <!-- Floating Elements -->
  <g transform="translate(620, 90)">
    <rect width="180" height="56" rx="28" fill="#0F172A" opacity="0.9" stroke="#F59E0B" stroke-width="1.5" />
    <circle cx="30" cy="28" r="16" fill="#10B981" />
    <path d="M 23 28 L 28 33 L 37 23" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
    <text x="56" y="26" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">WhatsApp Order</text>
    <text x="56" y="42" font-family="sans-serif" font-size="11" fill="#94A3B8">நேரடி முன்பதிவு</text>
  </g>
  <g transform="translate(90, 390)">
    <rect width="180" height="56" rx="28" fill="#0F172A" opacity="0.9" stroke="#38BDF8" stroke-width="1.5" />
    <text x="25" y="26" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">🚚 Doorstep Delivery</text>
    <text x="25" y="42" font-family="sans-serif" font-size="11" fill="#94A3B8">அதிவேக விநியோகம்</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(imgDir, 'hero-banner.svg'), heroSvg);

// Book definitions with color palettes and styling
const bookData = [
  {
    id: 'ponniyin-selvan',
    titleTa: 'பொன்னியின் செல்வன்',
    titleEn: 'Ponniyin Selvan',
    subtitle: '5 பாகங்கள் முழுத் தொகுப்பு',
    authorTa: 'கல்கி கிருஷ்ணமூர்த்தி',
    authorEn: 'Kalki Krishnamurthy',
    price: '₹1,250',
    mrp: '₹1,600',
    isbn: '978-81-8368-101-0',
    bgStart: '#1E1B4B',
    bgEnd: '#0F172A',
    accent: '#F59E0B',
    accentLight: '#FDE68A',
    motif: 'crown'
  },
  {
    id: 'sivagamiyin-sabatham',
    titleTa: 'சிவகாமியின் சபதம்',
    titleEn: 'Sivagamiyin Sabatham',
    subtitle: 'வரலாற்றுப் பேரிலக்கியம்',
    authorTa: 'கல்கி கிருஷ்ணமூர்த்தி',
    authorEn: 'Kalki Krishnamurthy',
    price: '₹680',
    mrp: '₹850',
    isbn: '978-81-8368-102-7',
    bgStart: '#881337',
    bgEnd: '#4C0519',
    accent: '#FB7185',
    accentLight: '#FFE4E6',
    motif: 'dancer'
  },
  {
    id: 'thirukkural',
    titleTa: 'திருக்குறள் எளிய உரை',
    titleEn: 'Thirukkural Comprehensive',
    subtitle: '1330 குறள்களும் எளிய விளக்கமும்',
    authorTa: 'திருவள்ளுவர்',
    authorEn: 'Thiruvalluvar',
    price: '₹390',
    mrp: '₹500',
    isbn: '978-81-8368-103-4',
    bgStart: '#064E3B',
    bgEnd: '#022C22',
    accent: '#34D399',
    accentLight: '#D1FAE5',
    motif: 'feather'
  },
  {
    id: 'atomic-habits',
    titleTa: 'அணுப் பழக்கங்கள்',
    titleEn: 'Atomic Habits',
    subtitle: 'வெற்றி தரும் சிறு மாற்றங்கள்',
    authorTa: 'ஜேம்ஸ் கிளியர்',
    authorEn: 'James Clear',
    price: '₹380',
    mrp: '₹450',
    isbn: '978-81-8368-104-1',
    bgStart: '#0C4A6E',
    bgEnd: '#082F49',
    accent: '#38BDF8',
    accentLight: '#BAE6FD',
    motif: 'atom'
  },
  {
    id: 'alchemist',
    titleTa: 'ஆல்கெமிஸ்ட்',
    titleEn: 'The Alchemist',
    subtitle: 'கனவுகளைத் தேடிய மாபெரும் பயணம்',
    authorTa: 'பாவ்லோ கொய்லோ',
    authorEn: 'Paulo Coelho',
    price: '₹280',
    mrp: '₹350',
    isbn: '978-81-8368-105-8',
    bgStart: '#78350F',
    bgEnd: '#451A03',
    accent: '#FBBF24',
    accentLight: '#FEF3C7',
    motif: 'sun'
  },
  {
    id: 'parthiban-kanavu',
    titleTa: 'பார்த்திபன் கனவு',
    titleEn: 'Parthiban Kanavu',
    subtitle: 'சோழ தேச வரலாற்று நாவல்',
    authorTa: 'கல்கி கிருஷ்ணமூர்த்தி',
    authorEn: 'Kalki Krishnamurthy',
    price: '₹320',
    mrp: '₹400',
    isbn: '978-81-8368-106-5',
    bgStart: '#581C87',
    bgEnd: '#3B0764',
    accent: '#C084FC',
    accentLight: '#F3E8FF',
    motif: 'sword'
  },
  {
    id: 'aram',
    titleTa: 'அறம்',
    titleEn: 'Aram - Stories of Virtue',
    subtitle: 'மனதை உருக்கும் உன்னத சிறுகதைகள்',
    authorTa: 'ஜெயமோகன்',
    authorEn: 'B. Jeyamohan',
    price: '₹420',
    mrp: '₹490',
    isbn: '978-81-8368-107-2',
    bgStart: '#1E293B',
    bgEnd: '#0F172A',
    accent: '#94A3B8',
    accentLight: '#F1F5F9',
    motif: 'leaf'
  },
  {
    id: 'bharathiyar',
    titleTa: 'பாரதியார் கவிதைகள்',
    titleEn: 'Bharathiyar Poems',
    subtitle: 'முழுத் தொகுப்பு பிரீமியம் பதிப்பு',
    authorTa: 'மகாகவி பாரதியார்',
    authorEn: 'Subramania Bharathiyar',
    price: '₹360',
    mrp: '₹450',
    isbn: '978-81-8368-108-9',
    bgStart: '#7F1D1D',
    bgEnd: '#450A0A',
    accent: '#F87171',
    accentLight: '#FEE2E2',
    motif: 'flame'
  }
];

function getMotifPath(motif, color) {
  switch (motif) {
    case 'crown':
      return `<path d="M 0 16 L 10 -4 L 20 10 L 30 -4 L 40 16 Z" fill="${color}" transform="translate(180, 160) scale(1)"/>`;
    case 'dancer':
      return `<circle cx="200" cy="160" r="14" fill="${color}" /><path d="M 195 174 Q 200 195 190 220 M 205 174 Q 200 195 210 220" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
    case 'feather':
      return `<path d="M 190 200 Q 200 150 215 140 Q 210 170 190 200 Z" fill="${color}" />`;
    case 'atom':
      return `<ellipse cx="200" cy="170" rx="30" ry="12" fill="none" stroke="${color}" stroke-width="2" transform="rotate(30 200 170)"/><ellipse cx="200" cy="170" rx="30" ry="12" fill="none" stroke="${color}" stroke-width="2" transform="rotate(-30 200 170)"/><circle cx="200" cy="170" r="6" fill="${color}"/>`;
    case 'sun':
      return `<circle cx="200" cy="170" r="18" fill="${color}"/><line x1="200" y1="140" x2="200" y2="148" stroke="${color}" stroke-width="3"/><line x1="200" y1="192" x2="200" y2="200" stroke="${color}" stroke-width="3"/><line x1="170" y1="170" x2="178" y2="170" stroke="${color}" stroke-width="3"/><line x1="222" y1="170" x2="230" y2="170" stroke="${color}" stroke-width="3"/>`;
    case 'sword':
      return `<line x1="180" y1="190" x2="220" y2="150" stroke="${color}" stroke-width="4" stroke-linecap="round"/><line x1="185" y1="175" x2="195" y2="185" stroke="${color}" stroke-width="4"/>`;
    case 'flame':
      return `<path d="M 200 145 Q 215 165 215 180 A 15 15 0 0 1 185 180 Q 185 165 200 145 Z" fill="${color}" />`;
    default:
      return `<circle cx="200" cy="170" r="16" fill="${color}" />`;
  }
}

// Generate 3 images for each book:
bookData.forEach(b => {
  // 1. FRONT COVER
  const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
    <defs>
      <linearGradient id="frontBg_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${b.bgStart}" />
        <stop offset="100%" stop-color="${b.bgEnd}" />
      </linearGradient>
      <linearGradient id="spineShade" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.4" />
        <stop offset="70%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.1" />
      </linearGradient>
      <filter id="glow_${b.id}">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <!-- Book Background -->
    <rect width="400" height="580" rx="8" fill="url(#frontBg_${b.id})" />
    <!-- Spine realistic overlay -->
    <rect x="0" y="0" width="36" height="580" fill="url(#spineShade)" />
    <!-- Decorative Frame -->
    <rect x="44" y="30" width="326" height="520" rx="6" fill="none" stroke="${b.accent}" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.6"/>
    <rect x="52" y="38" width="310" height="504" rx="4" fill="none" stroke="${b.accentLight}" stroke-width="0.8" opacity="0.4"/>
    
    <!-- Publisher Stamp -->
    <g transform="translate(60, 50)">
      <circle cx="16" cy="16" r="14" fill="${b.accent}" opacity="0.2" />
      <text x="36" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" fill="${b.accentLight}" letter-spacing="2">RAJ PUBLICATION</text>
    </g>

    <!-- Visual Motif -->
    ${getMotifPath(b.motif, b.accent)}

    <!-- Tamil Title -->
    <text x="207" y="240" font-family="'Noto Sans Tamil', serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" filter="url(#glow_${b.id})">
      ${b.titleTa}
    </text>
    
    <!-- Subtitle -->
    <text x="207" y="275" font-family="'Noto Sans Tamil', sans-serif" font-weight="500" font-size="14" fill="${b.accentLight}" text-anchor="middle">
      ${b.subtitle}
    </text>

    <!-- English Title -->
    <text x="207" y="300" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="13" fill="#94A3B8" text-anchor="middle" letter-spacing="1.5">
      ${b.titleEn.toUpperCase()}
    </text>

    <!-- Divider -->
    <line x1="120" y1="325" x2="294" y2="325" stroke="${b.accent}" stroke-width="1.5" />
    <circle cx="207" cy="325" r="4" fill="${b.accent}" />

    <!-- Author Section -->
    <text x="207" y="375" font-family="'Noto Sans Tamil', sans-serif" font-weight="600" font-size="13" fill="#CBD5E1" text-anchor="middle" letter-spacing="1">
      எழுத்தாளர் / AUTHOR
    </text>
    <text x="207" y="405" font-family="'Noto Sans Tamil', serif" font-weight="800" font-size="22" fill="#FFFFFF" text-anchor="middle">
      ${b.authorTa}
    </text>
    <text x="207" y="428" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="12" fill="#CBD5E1" text-anchor="middle">
      (${b.authorEn})
    </text>

    <!-- Gold Foil Badge -->
    <g transform="translate(145, 465)">
      <rect width="124" height="32" rx="16" fill="${b.accent}" />
      <text x="62" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="11" fill="#0F172A" text-anchor="middle" letter-spacing="1">ORIGINAL PRINT</text>
    </g>

    <!-- Bottom Watermark -->
    <text x="207" y="525" font-family="sans-serif" font-size="10" fill="${b.accentLight}" opacity="0.6" text-anchor="middle">
      [முன் அட்டை • FRONT COVER]
    </text>
  </svg>`;
  fs.writeFileSync(path.join(booksDir, `${b.id}-front.svg`), frontSvg);

  // 2. BACK COVER
  const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
    <defs>
      <linearGradient id="backBg_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${b.bgEnd}" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="580" rx="8" fill="url(#backBg_${b.id})" />
    <!-- Spine shadow on right for back cover -->
    <rect x="364" y="0" width="36" height="580" fill="#000000" opacity="0.35" />
    
    <!-- Outer line -->
    <rect x="30" y="30" width="326" height="520" rx="6" fill="none" stroke="${b.accent}" stroke-width="1.2" opacity="0.4"/>

    <!-- Header / Praise -->
    <g transform="translate(50, 55)">
      <text x="0" y="20" font-family="'Noto Sans Tamil', serif" font-weight="700" font-size="18" fill="${b.accent}">நூல் அறிமுகம் &amp; மதிப்புரை</text>
      <line x1="0" y1="30" x2="80" y2="30" stroke="${b.accent}" stroke-width="2"/>
    </g>

    <!-- Blurb Quotes -->
    <g transform="translate(50, 110)">
      <rect width="286" height="150" rx="8" fill="#1E293B" opacity="0.6" stroke="${b.accent}" stroke-width="0.8" />
      <text x="16" y="32" font-family="'Noto Sans Tamil', sans-serif" font-size="13" fill="#E2E8F0" font-weight="500">
        "தமிழ் வாசகர்களின் நெஞ்சங்களை
      </text>
      <text x="16" y="54" font-family="'Noto Sans Tamil', sans-serif" font-size="13" fill="#E2E8F0" font-weight="500">
        காலங்காலமாய் ஆட்கொள்ளும்
      </text>
      <text x="16" y="76" font-family="'Noto Sans Tamil', sans-serif" font-size="13" fill="#E2E8F0" font-weight="500">
        அரிய படைப்பு. ராஜ் பப்ளிகேஷன்
      </text>
      <text x="16" y="98" font-family="'Noto Sans Tamil', sans-serif" font-size="13" fill="#E2E8F0" font-weight="500">
        வழங்கும் இந்த நேர்த்தியான பதிப்பு
      </text>
      <text x="16" y="120" font-family="'Noto Sans Tamil', sans-serif" font-size="13" fill="${b.accentLight}" font-weight="600">
        உங்கள் நூலகத்தில் இருக்க வேண்டிய ஒன்று!"
      </text>
    </g>

    <!-- Star Ratings -->
    <g transform="translate(50, 280)">
      <text x="0" y="18" font-size="16" fill="${b.accent}">★★★★★</text>
      <text x="90" y="16" font-family="sans-serif" font-size="12" fill="#94A3B8">வாசகர் மதிப்பீடு: 4.9/5</text>
    </g>

    <!-- Features Check -->
    <g transform="translate(50, 320)">
      <text x="0" y="18" font-family="'Noto Sans Tamil', sans-serif" font-size="12" fill="#CBD5E1">✓ உயர்தர கெட்டி அட்டை வடிவமைப்பு</text>
      <text x="0" y="40" font-family="'Noto Sans Tamil', sans-serif" font-size="12" fill="#CBD5E1">✓ கண்களுக்கு இதமான தரமான காகித அச்சு</text>
      <text x="0" y="62" font-family="'Noto Sans Tamil', sans-serif" font-size="12" fill="#CBD5E1">✓ வாட்ஸ்அப் வழி நேரடி விரைவு டெலிவரி</text>
    </g>

    <!-- Barcode & Price Box -->
    <g transform="translate(50, 420)">
      <rect width="286" height="85" rx="6" fill="#FFFFFF" />
      <!-- Barcode simulation -->
      <g transform="translate(14, 12)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#000" stroke-width="2"/>
        <line x1="4" y1="0" x2="4" y2="40" stroke="#000" stroke-width="1"/>
        <line x1="8" y1="0" x2="8" y2="40" stroke="#000" stroke-width="3"/>
        <line x1="14" y1="0" x2="14" y2="40" stroke="#000" stroke-width="1.5"/>
        <line x1="18" y1="0" x2="18" y2="40" stroke="#000" stroke-width="2"/>
        <line x1="24" y1="0" x2="24" y2="40" stroke="#000" stroke-width="4"/>
        <line x1="32" y1="0" x2="32" y2="40" stroke="#000" stroke-width="1"/>
        <line x1="36" y1="0" x2="36" y2="40" stroke="#000" stroke-width="2.5"/>
        <line x1="44" y1="0" x2="44" y2="40" stroke="#000" stroke-width="1.5"/>
        <line x1="50" y1="0" x2="50" y2="40" stroke="#000" stroke-width="3"/>
        <line x1="58" y1="0" x2="58" y2="40" stroke="#000" stroke-width="1"/>
        <line x1="64" y1="0" x2="64" y2="40" stroke="#000" stroke-width="2"/>
        <line x1="72" y1="0" x2="72" y2="40" stroke="#000" stroke-width="3.5"/>
        <line x1="80" y1="0" x2="80" y2="40" stroke="#000" stroke-width="1.5"/>
        <line x1="88" y1="0" x2="88" y2="40" stroke="#000" stroke-width="2"/>
        <line x1="96" y1="0" x2="96" y2="40" stroke="#000" stroke-width="4"/>
        <line x1="106" y1="0" x2="106" y2="40" stroke="#000" stroke-width="1"/>
        <text x="53" y="52" font-family="monospace" font-size="9" fill="#000" text-anchor="middle">${b.isbn}</text>
      </g>
      <!-- Price details -->
      <g transform="translate(145, 18)">
        <text x="0" y="16" font-family="sans-serif" font-size="11" fill="#64748B">விலை (MRP): <tspan text-decoration="line-through">${b.mrp}</tspan></text>
        <text x="0" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="18" fill="#0F172A">சிறப்பு: ${b.price}</text>
        <text x="0" y="54" font-family="'Noto Sans Tamil', sans-serif" font-size="10" fill="#15803D" font-weight="bold">தள்ளுபடி விலை</text>
      </g>
    </g>

    <!-- Bottom label -->
    <text x="193" y="530" font-family="sans-serif" font-size="10" fill="${b.accentLight}" opacity="0.6" text-anchor="middle">
      [பின் அட்டை • BACK COVER]
    </text>
  </svg>`;
  fs.writeFileSync(path.join(booksDir, `${b.id}-back.svg`), backSvg);

  // 3. INSIDE SAMPLE PAGE
  const insideSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 580" width="400" height="580">
    <defs>
      <linearGradient id="pageBg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E2D9C8" />
        <stop offset="5%" stop-color="#FDFBF7" />
        <stop offset="95%" stop-color="#FDFBF7" />
        <stop offset="100%" stop-color="#EAE3D2" />
      </linearGradient>
      <linearGradient id="gutterShadow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.18" />
        <stop offset="50%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.0" />
      </linearGradient>
    </defs>
    <!-- Paper page spread -->
    <rect width="400" height="580" rx="6" fill="url(#pageBg)" stroke="#CBD5E1" stroke-width="1" />
    <rect x="0" y="0" width="28" height="580" fill="url(#gutterShadow)" />

    <!-- Top Running Header -->
    <text x="44" y="42" font-family="'Noto Sans Tamil', sans-serif" font-size="10" fill="#64748B">${b.titleTa} • ${b.authorTa}</text>
    <text x="356" y="42" font-family="sans-serif" font-size="10" fill="#64748B" text-anchor="end">பக்கம் 25</text>
    <line x1="44" y1="52" x2="356" y2="52" stroke="#CBD5E1" stroke-width="0.8" />

    <!-- Chapter Header -->
    <g transform="translate(200, 95)">
      <text x="0" y="0" font-family="'Noto Sans Tamil', sans-serif" font-size="12" fill="#B45309" text-anchor="middle" font-weight="bold">அத்தியாயம் - 1</text>
      <text x="0" y="24" font-family="'Noto Sans Tamil', serif" font-size="17" fill="#1E293B" text-anchor="middle" font-weight="bold">ஆரம்பக் கட்டம்</text>
      <line x1="-30" y1="36" x2="30" y2="36" stroke="#B45309" stroke-width="1" />
    </g>

    <!-- Simulated Elegant Tamil Typeset Book Text -->
    <g transform="translate(44, 160)">
      <!-- Drop Cap -->
      <rect x="0" y="0" width="38" height="42" rx="4" fill="${b.bgStart}" />
      <text x="19" y="32" font-family="'Noto Sans Tamil', serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle">அ</text>

      <!-- Paragraph 1 Lines -->
      <text x="46" y="16" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">ந்த அழகிய மாலைப் பொழுதில் சோழ நாட்டின்</text>
      <text x="46" y="34" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வளம் கொழிக்கும் வீதிகளில் மக்கள் உற்சாகமாக</text>
      <text x="0" y="54" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">கூடிப் பேசிக் கொண்டிருந்தனர். அங்கே வீசிய மெல்லிய தென்றல்</text>
      <text x="0" y="74" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">காவிரியின் நறுமணத்தை எங்கும் பரப்பிக் கொண்டிருந்தது.</text>
      <text x="0" y="94" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வீரமும் விவேகமும் நிறைந்த அந்தப் பெருநிலப்பரப்பில் புதியதோர்</text>
      <text x="0" y="114" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வரலாறு எழுதப்படத் தொடங்கியதை எவரும் அப்போது அறிந்திருக்கவில்லை.</text>

      <!-- Paragraph 2 Lines -->
      <text x="24" y="146" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வாழ்வின் உன்னத விழுமியங்களும், மனித நேயத்தின் பெருமையும்</text>
      <text x="0" y="166" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">ஒவ்வொரு பக்கத்திலும் மிளிரும் வண்ணம் அமைந்த இந்த அத்தியாயம்</text>
      <text x="0" y="186" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வாசகர்களின் கற்பனைச் சிறகுகளை விரிக்கச் செய்கிறது. கலைநயமிக்க</text>
      <text x="0" y="206" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">வார்த்தைகளும், ஆழமான சிந்தனைகளும் நெஞ்சை அள்ளுகின்றன.</text>

      <!-- Paragraph 3 Lines -->
      <text x="24" y="238" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">"கற்றது கைம்மண் அளவு, கல்லாதது உலகளவு" என்ற தமிழ் மூதுரைக்கு</text>
      <text x="0" y="258" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">ஏற்ப, நூல்களை வாசிப்பது நம்மை ஒரு புதிய உலகிற்கு அழைத்துச்</text>
      <text x="0" y="278" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">செல்கிறது. மனதிற்கு அமைதியும் ஞானமும் அளிக்கும் இந்த அரிய</text>
      <text x="0" y="298" font-family="'Noto Sans Tamil', sans-serif" font-size="11.5" fill="#334155">நூலின் ஒவ்வொரு பக்கமும் பொக்கிஷமாக திகழ்கிறது.</text>
    </g>

    <!-- Watermark Stamp for Sample Inside Page -->
    <g transform="translate(100, 485)">
      <rect width="200" height="34" rx="17" fill="#FEF3C7" stroke="#D97706" stroke-width="1.2" />
      <text x="100" y="22" font-family="'Noto Sans Tamil', sans-serif" font-size="12" font-weight="bold" fill="#92400E" text-anchor="middle">
        📖 மாதிரிப் பக்கம் (SAMPLE PREVIEW)
      </text>
    </g>

    <text x="200" y="542" font-family="sans-serif" font-size="10" fill="#64748B" text-anchor="middle">
      [உள் பக்க முன்னோட்டம் • SAMPLE INSIDE PAGE]
    </text>
  </svg>`;
  fs.writeFileSync(path.join(booksDir, `${b.id}-inside.svg`), insideSvg);
});

console.log('Successfully generated all book SVGs, logo, favicon, and hero banner!');
