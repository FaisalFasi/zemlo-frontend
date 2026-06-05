import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
};
export default AuthLayout;

const Header = () => {
  return (
    <div className="relative">
      <div className="absolute top-15 inset-x-0 mx-auto md:mx-0 md:top-10 md:left-10 z-50 w-35 h-14">
        <Link href={"/"}>
          <Image
            src={"/images/logo/logo.png"}
            alt={"logo"}
            width={100}
            height={100}
          />
        </Link>
      </div>
    </div>
  );
};
