/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Trusted image hosts ki EK list — next.config.ts (Next.js
 * ko batati hai kaunsi hosts optimize karni allowed hain) aur
 * safe-image-url.ts (runtime par URLs check karta hai) dono isi list
 * ko parhte hain.
 * REASON: Pehle ye list sirf next.config.ts mein thi. Admin product
 * form ka image field abhi khaali URL text-box hai (Cloudinary upload
 * BACKEND-TODO mein pending), to koi bhi host paste ho sakta hai. Agar
 * dono jagah alag-alag list hoti (copy-paste) to kabhi na kabhi
 * out-of-sync ho jati — ek jagah rakhna hi sahi tareeqa hai.
 * RISK: Zero — sirf data, koi logic nahi.
 * ═════════════════════════════════════════════════════════════════
 */
export const ALLOWED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "swiperjs.com",
  // Add your CDN here when image uploads land (e.g. "res.cloudinary.com").
] as const;
