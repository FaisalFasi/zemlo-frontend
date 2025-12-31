import { CButton } from "@/components/custom/button/CButton";
import { CInput } from "@/components/custom/input/CInput";
import Image from "next/image";

const Login = () => {
  return (
    <div className="w-full h-full min-h-screen grid grid-cols-1 md:grid-cols-2 ">
      <div className="relative h-screen hidden md:block">
        <Image
          src={"/images/auth/login.png"}
          alt="Login Image"
          fill
          className="object-cover "
          sizes="100vw"
          priority
        />
      </div>
      <div className="min-h-screen flex flex-col justify-center p-2 lg:px-10 py-40 md:py-0">
        <div className="w-fit md:w-full flex flex-col  justify-start ">
          <h2>Welcome 👋</h2>
          <p>Please login here</p>
        </div>
        <div className=" w-full max-w-100 md:max-w-111">
          <form
            action=""
            className="w-full flex flex-col gap-4   md:max-w-full lg:max-w-111 "
          >
            <CInput
              type="email"
              placeholder="email"
              id="email"
              label="Email Address"
            />
            <CInput
              type="password"
              placeholder="password"
              id="password"
              label="Password"
            />
            <div className="flex justify-between text-sm hover:cursor-pointer">
              <CInput type="checkbox" label=" Remember Me" />
              <span className=""> Forgot Password</span>
            </div>
            <CButton>Login</CButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
