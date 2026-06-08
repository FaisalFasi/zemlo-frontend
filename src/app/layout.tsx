import type { Metadata } from "next";

import { appConfig } from "@/shared/config/app";
import AppProviders from "@/shared/providers/AppProviders";
import { createSiteJsonLd } from "@/shared/seo/site-json-ld";
import { safeJsonLd } from "@/shared/lib/seo";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.siteUrl),
  applicationName: appConfig.name,
  title: {
    default: appConfig.name,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  openGraph: {
    type: "website",
    siteName: appConfig.name,
    title: appConfig.name,
    description: appConfig.description,
    url: appConfig.siteUrl,
    locale: appConfig.defaultLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: appConfig.name,
    description: appConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteJsonLd = createSiteJsonLd();

  return (
    <html lang={appConfig.defaultLocale}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(siteJsonLd),
          }}
        />

        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// // import { Inter, Jost, Playfair_Display, Poppins } from "next/font/google";
// import AppProviders from "@/shared/providers/AppProviders";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });
// const jost = Jost({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-jost",
// });

// const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-poppins",
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-playfair",
// });

// export const metadata: Metadata = {
//   title: "Zemlo",
//   description: "Zemlo E-Shop",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         // className={`font-sans ${inter.variable} ${poppins.variable} ${playfair.variable} ${jost.variable} antialiased`}
//         suppressHydrationWarning
//       >
//         <AppProviders>{children}</AppProviders>
//       </body>
//     </html>
//   );
// }
