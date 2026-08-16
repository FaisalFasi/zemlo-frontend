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
 * 2026-08-16: real image upload abhi backend mein pending tha (see
 * BACKEND-TODO.md), to admin ko free image hosts se test karne dene ke
 * liye list thodi wider ki hai — sab read-only public image CDNs hain,
 * koi upload/auth surface nahi.
 * 2026-08-17: real upload (POST /admin/uploads/image) live ho gaya —
 * Cloudinary URLs (res.cloudinary.com) add ki hain.
 * ═════════════════════════════════════════════════════════════════
 */
export const ALLOWED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "swiperjs.com",
  "images.pexels.com",
  "cdn.pixabay.com",
  "i.imgur.com",
  "placehold.co",
  "picsum.photos",
  "res.cloudinary.com",
] as const;
