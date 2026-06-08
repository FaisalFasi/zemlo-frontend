import type { Metadata } from "next";
// import { Inter, Jost, Playfair_Display, Poppins } from "next/font/google";
import AppProviders from "@/shared/providers/AppProviders";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Zemlo",
  description: "Zemlo E-Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`font-sans ${inter.variable} ${poppins.variable} ${playfair.variable} ${jost.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
