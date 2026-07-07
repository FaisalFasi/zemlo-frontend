import Navbar from "@/widgets/public-navbar/navbar/navbar";
import { PublicFooter } from "@/widgets/public-navbar/public-footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <PublicFooter />
    </>
  );
}
