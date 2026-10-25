# 📚 Raj Publication — புதிய புத்தகங்கள் சேர்க்கும் வழிகாட்டி (How to Add Books)

இந்த இணையதளம் முழுக்க முழுக்க **JSON கோப்பு (`data/books.json`)** வழியாக இயங்கும் வகையில் உருவாக்கப்பட்டுள்ளது. புதிய புத்தகங்களை சேர்க்க நீங்கள் எந்த HTML அல்லது JavaScript குறியீடுகளையும் மாற்ற வேண்டிய அவசியமில்லை!

---

## 1. வாட்ஸ்அப் எண் மாற்றுவது எப்படி? (How to Change WhatsApp Number)

`data/config.json` கோப்பைத் திறந்து:
```json
{
  "siteName": "Raj Publication",
  "whatsappNumber": "919876543210",
  "whatsappDisplayNumber": "+91 98765 43210",
  "phone": "+91 98765 43210",
  "email": "rajpublicationbooks@gmail.com",
  "address": "Raj Publication, Chennai, Tamil Nadu, India",
  "deliveryCharge": 40,
  "freeDeliveryThreshold": 499
}
```
👉 `whatsappNumber` என்பதில் உங்கள் 10 இலக்க மொபைல் எண்ணை நாட்டின் குறியீட்டுடன் (`91` முன்னொட்டுடன்) உள்ளிடவும் (எ.கா: `919840012345`).

---

## 2. புதிய புத்தகம் சேர்ப்பது எப்படி? (How to Add a New Book)

`data/books.json` கோப்பில் கீழே உள்ள அமைப்பில் ஒரு புதிய பதிவை (object) சேருங்கள்:

```json
{
  "id": "my-new-book-id",
  "title": "புத்தகத்தின் தமிழ் பெயர்",
  "titleEn": "Book Title in English",
  "author": "எழுத்தாளர் பெயர்",
  "authorEn": "Author Name in English",
  "category": "historical-fiction", 
  "categoryName": "வரலாற்று நாவல் / Historical Novel",
  "price": 350,
  "originalPrice": 450,
  "discountPercent": 22,
  "inStock": true,
  "featured": true,
  "badge": "BESTSELLER",
  "rating": 4.9,
  "reviewCount": 85,
  "images": {
    "front": "assets/images/books/my-book-front.jpg",
    "back": "assets/images/books/my-book-back.jpg",
    "inside": "assets/images/books/my-book-inside.jpg"
  },
  "gallery": [
    {
      "url": "assets/images/books/my-book-front.jpg",
      "title": "முன் அட்டை / Front Cover",
      "description": "புத்தகத்தின் முகப்பு தோற்றம்"
    },
    {
      "url": "assets/images/books/my-book-back.jpg",
      "title": "பின் அட்டை / Back Cover",
      "description": "நூல் அறிமுகம் மற்றும் விலை"
    },
    {
      "url": "assets/images/books/my-book-inside.jpg",
      "title": "உள் பக்க மாதிரி / Sample Inside Pages",
      "description": "உயர்தர வாசிப்பு பக்கங்கள்"
    }
  ],
  "isbn": "978-81-8368-999-9",
  "pages": 320,
  "language": "தமிழ் (Tamil)",
  "publisher": "Raj Publication",
  "edition": "2026 புதிய பதிப்பு",
  "binding": "ஹார்ட்கவர் (Hardcover)",
  "weight": "0.45 kg",
  "dimensions": "21.0 x 14.0 x 2.5 cm",
  "shortDescription": "புத்தகத்தின் சுருக்கமான 2-3 வரி அறிமுகம்.",
  "fullDescription": "புத்தகம் பற்றிய முழுமையான விளக்கம் மற்றும் அதன் பெருமைகள்...",
  "highlights": [
    "உயர்தர காகித அச்சு",
    "தெளிவான எழுத்துக்கள்",
    "வாட்ஸ்அப் வழி நேரடி விநியோகம்"
  ],
  "seo": {
    "metaTitle": "புத்தகப் பெயர் வாங்க | Raj Publication Tamil Books",
    "metaDescription": "புத்தகம் பற்றிய சுருக்கமான கூகுள் தேடல் விளக்கம்.",
    "keywords": "புத்தக பெயர், tamil book online, raj publication"
  }
}
```

### கிடைக்கும் புத்தகப் பிரிவுகள் (Category IDs):
- `historical-fiction` (வரலாற்று நாவல்)
- `literature` (செவ்விலக்கியம் & நவீனம்)
- `self-help` (சுயமுன்னேற்றம்)
- `poetry` (கவிதை)

---

## 3. படங்கள் வைக்கும் முறை (Book Images)

ஒவ்வொரு புத்தகத்திற்கும் **3 படங்கள்** தேவை:
1. **முன் அட்டை (Front Cover)**: எ.கா: `assets/images/books/book-name-front.jpg`
2. **பின் அட்டை (Back Cover)**: எ.கா: `assets/images/books/book-name-back.jpg`
3. **உள் பக்கம் (Sample Inside Page)**: எ.கா: `assets/images/books/book-name-inside.jpg`

படங்களை `assets/images/books/` கோப்புறையில் இட்டு, அதன் பெயரை `data/books.json` கோப்பில் உள்ளிடவும். JPG, PNG அல்லது WebP வடிவங்கள் பயன்படுத்தலாம்.

---

## 4. GitHub Pages-ல் ஹோஸ்டிங் செய்வது எப்படி? (GitHub Pages Deployment)

1. உங்கள் கோப்புகளை GitHub-ல் புஷ் செய்யுங்கள்:
   ```bash
   git add .
   git commit -m "Raj Publication store setup"
   git push origin main
   ```
2. GitHub இணையதளத்தில் உங்கள் repository (`rajpublication`) பக்கத்திற்கு செல்லவும்.
3. **Settings** &rarr; **Pages** &rarr; **Build and deployment** பகுதியில்:
   - Source: **Deploy from a branch**
   - Branch: **main** மற்றும் கோப்புறை: **/ (root)** என்பதைத் தேர்வு செய்து **Save** செய்யவும்.
4. 1-2 நிமிடங்களில் உங்கள் இணையதளம் நேரலையாகிவிடும்:
   👉 **`https://murugannagaraja781.github.io/rajpublication/`**
