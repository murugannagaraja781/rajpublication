const fs = require('fs');
const path = require('path');

const booksPath = path.join(__dirname, 'data', 'books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

// Tamil to English translation mappings for academic & competitive exam terms
function getEnglishTitle(title, categoryName) {
  let en = title;
  
  // Specific known books
  if (en.includes('காவலர் தமிழ்')) {
    return 'Kavalar Tamil (TNUSRB Police Constable & SI Exam Guide)';
  }
  
  en = en
    .replace(/காவலர்/g, 'Police / Kavalar')
    .replace(/தமிழ்/g, 'Tamil')
    .replace(/அறிவியல்/g, 'Science')
    .replace(/சமூக அறிவியல்/g, 'Social Science')
    .replace(/கணிதம்/g, 'Maths (Mathematics)')
    .replace(/உளவியல்/g, 'Psychology')
    .replace(/பொது அறிவு/g, 'General Knowledge (GK)')
    .replace(/பொது அறிவுப் பகுதி/g, 'General Knowledge Part')
    .replace(/வினா வங்கி/g, 'Question Bank')
    .replace(/பகுதி/g, 'Part')
    .replace(/புத்தகம்/g, 'Book')
    .replace(/தேர்வு/g, 'Exam')
    .replace(/ஆசிரியர் தகுதித் தேர்வு/g, 'TNTET Teacher Eligibility Test')
    .replace(/வழிகாட்டி/g, 'Guide');

  return en.trim();
}

function generateEnglishKeywords(book) {
  const list = [
    'Raj Publication',
    'Raj Publication books',
    'Raj Publication Pethanadarpatti',
    'Raj Publication Pavoorchatram',
    'buy tamil books online',
    'tamil competitive exam books'
  ];

  const titleLower = (book.title || '').toLowerCase();
  const enTitle = book.titleEn || getEnglishTitle(book.title, book.categoryName);

  list.push(enTitle);

  // Exam specific English keywords
  if (titleLower.includes('காவலர்') || titleLower.includes('police')) {
    list.push(
      'Kavalar Tamil book',
      'TNUSRB Police exam book',
      'Police constable Tamil book',
      'Police exam Tamil guide',
      'TNUSRB SI exam Tamil book',
      'Tamil Nadu police exam study material'
    );
  }

  if (titleLower.includes('tet') || titleLower.includes('ஆசிரியர்')) {
    list.push(
      'TNTET Paper 1 book',
      'TNTET Paper 2 book',
      'TNTET Tamil guide',
      'TNTET exam study material',
      'Tamil Nadu Teacher Eligibility Test books'
    );
  }

  if (titleLower.includes('tnpsc')) {
    list.push(
      'TNPSC Tamil books',
      'TNPSC Group 4 Tamil book',
      'TNPSC Group 2 Tamil study material',
      'TNPSC General Tamil guide'
    );
  }

  if (titleLower.includes('6 - 10') || titleLower.includes('6-10') || titleLower.includes('sslc')) {
    list.push(
      '6 to 10 Tamil book',
      '6th to 10th Samacheer Kalvi Tamil book',
      'SSLC STD Tamil book Raj Publication'
    );
  }

  if (titleLower.includes('6 - 12') || titleLower.includes('6-12')) {
    list.push(
      '6 to 12 Tamil book',
      '6th to 12th Samacheer Kalvi Tamil guide',
      'School Tamil books Raj Publication'
    );
  }

  if (titleLower.includes('உளவியல்') || titleLower.includes('psychology')) {
    list.push(
      'TNTET Psychology book',
      'TET Paper 1 Psychology',
      'TET Paper 2 Psychology Tamil'
    );
  }

  if (titleLower.includes('பொது அறிவு') || titleLower.includes('gk')) {
    list.push(
      'Tamil General Knowledge book',
      'Competitive Exam GK book Tamil',
      'TNUSRB SI GK book'
    );
  }

  if (titleLower.includes('வினா வங்கி') || titleLower.includes('question bank')) {
    list.push(
      'Tamil question bank book',
      'Exam question bank Raj Publication'
    );
  }

  return [...new Set(list)].join(', ');
}

// Update all books
books.forEach(book => {
  const enTitle = getEnglishTitle(book.title, book.categoryName);
  book.titleEn = enTitle;
  
  const enKeywords = generateEnglishKeywords(book);
  if (!book.seo) book.seo = {};
  book.seo.keywords = `${book.title}, ${enKeywords}`;
  
  if (!book.shortDescriptionEn) {
    book.shortDescriptionEn = `${enTitle} published by Raj Publication. Perfect study material for Tamil Nadu competitive exams with WhatsApp doorstep delivery.`;
  }
});

fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), 'utf8');
console.log(`Successfully updated ${books.length} books with English titles, descriptions, and English SEO keywords.`);
