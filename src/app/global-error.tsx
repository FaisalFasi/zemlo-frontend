/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Sab se aakhri safety-net — agar ROOT layout.tsx khud
 * crash ho jaye (jahan har normal error.tsx kaam nahi karta, kyunke
 * wo layout ke ANDAR hote hain), Next.js sirf isi file ko dikhata hai.
 * Isi liye ye apna <html>/<body> khud banata hai — root layout ko
 * bypass karta hai.
 * REASON: Audit mein pehle se pakra hua gap (docs/AUDIT.md H8) — is se
 * pehle koi bhi root-level crash browser ka bilkul khaali/default
 * error page dikhata, kuch bhi branded ya "try again" wala button nahi.
 * RISK: Zero — sirf fallback UI, aur ye sirf sab se worst-case
 * scenario mein dikhta hai.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import "./globals.css";

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Something went wrong
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-foreground">
            Zemlo hit an unexpected error.
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Please try again. If the problem continues, refresh the page.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
