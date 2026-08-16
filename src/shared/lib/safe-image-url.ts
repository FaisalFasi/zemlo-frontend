/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Backend se aayi kisi bhi image URL ko `<Image>` tak
 * pahunchne se PEHLE check karta hai — kya iska host allowlist
 * (ALLOWED_IMAGE_HOSTS) mein hai? Nahi to fallback image de deta hai.
 * REASON: Admin product form ka image field abhi khaali URL text-box
 * hai — koi bhi host paste ho sakta hai. Next.js ka <Image> ghair-
 * allowed host par HARD CRASH karta hai jo poore page ko gira deta
 * hai (ek ghalat product = poori /shop page sab customers ke liye
 * down). Ye function us crash ko "graceful fallback" mein badalta hai.
 * RISK: Zero — pure function, koi side effect nahi.
 * ═════════════════════════════════════════════════════════════════
 */
import { ALLOWED_IMAGE_HOSTS } from "@/shared/config/image-hosts";

export function getSafeImageUrl(
  url: string | null | undefined,
  fallback: string,
) {
  if (!url) return fallback;

  // Local/same-origin assets (our own placeholder, future uploads served
  // from this app) are always safe — Next.js only restricts remote hosts.
  if (url.startsWith("/")) return url;

  try {
    const { hostname } = new URL(url);

    return (ALLOWED_IMAGE_HOSTS as readonly string[]).includes(hostname)
      ? url
      : fallback;
  } catch {
    // Not a valid absolute URL at all — never pass it to <Image>.
    return fallback;
  }
}
