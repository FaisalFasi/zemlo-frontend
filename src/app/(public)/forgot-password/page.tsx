import { CButton } from "@/components/custom/button/CButton";
import { CInput } from "@/components/custom/input/CInput";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

const ForgotPassword = () => {
  return (
    <div className="w-full min-h-screen h-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src={"/images/auth/forgot-password.png"}
          alt="forgot-password"
          fill
          className="object-cover"
        />
      </div>
      <div className="max-w-111.25 h-full flex flex-col justify-center  p-2 lg:px-10 py-40 md:py-0">
        <div className="my-4">
          <CButton
            type="button"
            className="w-fit p-0 bg-transparent text-black hover:bg-transparent hover:text-primary-400"
            hoverAffect={false}
            leftIcon={<ArrowLeft />}
          >
            Back
          </CButton>
        </div>
        <div>
          <h2>Forgot Password</h2>
          <p>
            Enter your registered email address. we’ll send you a code to reset
            your password.
          </p>
        </div>
        <div>
          <form action="" className="flex flex-col gap-6">
            <CInput type="email" label="Email Address" />
            <CButton type="submit">Send OTP</CButton>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
