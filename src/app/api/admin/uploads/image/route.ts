/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /api/admin/uploads/image ka route handler — admin product/
 * variant image upload (backend Cloudinary par store karta hai).
 * REASON: Baaki admin proxy routes (`proxyToBackend`) sirf JSON bodies
 * handle karte hain (request.json() se parse karke dobara stringify) —
 * ek file upload multipart/form-data hai, wo tareeqa yahan kaam nahi
 * karta. Isliye ye route apna alag, form-data-aware forwarding karta hai:
 * incoming multipart parse karo (Next.js ka apna request.formData()),
 * file nikaalo, backend ko naya FormData bhejo. Generated axios client
 * (uploadsControllerUploadImage) is liye use nahi kiya — wo customer-
 * session proxy (/api/backend) se hota hai, admin token se nahi.
 * RISK: Zero — backend khud products.update permission enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
import { NextResponse } from "next/server";

import { createBackendUrl, readBackendResponse } from "@/lib/api/backend";
import { adminSessionCookie } from "@/lib/auth/session-cookies";

export async function POST(request: Request) {
  const sessionToken = await adminSessionCookie.get();

  if (!sessionToken) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const incomingFormData = await request.formData();
  const file = incomingFormData.get("file");

  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { message: "No image file provided." },
      { status: 400 },
    );
  }

  const outgoingFormData = new FormData();
  outgoingFormData.append("file", file);

  const response = await fetch(createBackendUrl("/admin/uploads/image"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    body: outgoingFormData,
  });

  const responseBody = await readBackendResponse(response);

  return NextResponse.json(responseBody, { status: response.status });
}
