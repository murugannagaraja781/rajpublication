/**
 * RAJ PUBLICATION — CONFIGURATION MANAGER
 * Loads site settings from data/config.json with safe fallbacks
 */

const DEFAULT_CONFIG = {
  siteName: "Raj Publication",
  siteNameTamil: "ராஜ் பப்ளிகேஷன்",
  tagline: "நேர்த்தியான பதிப்புகள் • உங்கள் வாசிப்புக்கான சிறந்த புத்தகங்கள்",
  taglineEn: "Premium Tamil & English Books — Direct to Your Doorstep",
  whatsappNumber: "919876543210",
  whatsappDisplayNumber: "+91 98765 43210",
  phone: "+91 98765 43210",
  email: "rajpublicationbooks@gmail.com",
  address: "Raj Publication, Chennai, Tamil Nadu, India - 600001",
  currency: "₹",
  deliveryCharge: 40,
  freeDeliveryThreshold: 499,
  announcement: "✨ அனைத்து புத்தகங்களுக்கும் சிறப்பு தள்ளுபடி! வாட்ஸ்அப்பில் நேரடி முன்பதிவு செய்யலாம் ✨",
  upiId: "rajpublication@upi",
  siteUrl: "https://murugannagaraja781.github.io/rajpublication/"
};

let storeConfig = { ...DEFAULT_CONFIG };

async function loadStoreConfig() {
  try {
    const res = await fetch('data/config.json');
    if (res.ok) {
      const data = await res.json();
      storeConfig = { ...DEFAULT_CONFIG, ...data };
    }
  } catch (err) {
    console.warn('Using default store config due to fetch error:', err);
  }
  return storeConfig;
}

window.getStoreConfig = () => storeConfig;
window.loadStoreConfig = loadStoreConfig;
