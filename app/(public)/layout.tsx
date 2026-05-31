import Navbar from "@/components/layout/navbar/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full fixed top-0 z-50">
        <Navbar />
      </div>
      <div className="pt-20">{children}</div>
    </>
  );
}
