"use client";
import { CButton } from "@/components/custom/button/CButton";
import { InputOTPPattern } from "@/components/custom/otp/otp";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const OTP = () => {
  const [value, setValue] = useState<string>("");

  return (
    <div className="w-full min-h-screen h-full grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src={"/images/auth/otp.png"}
          alt="otp"
          fill
          className="object-cover"
        />
      </div>
      <div className="max-w-111.25 h-full flex flex-col justify-center  p-2 lg:px-10 py-40 md:py-0 overflow-scroll">
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
          <h2>Enter OTP</h2>
          <p>We have share a code of your registered email address</p>
        </div>
        <div>
          <form action="" className="flex flex-col gap-6">
            <div>
              <InputOTPPattern value={value} setValue={setValue} />
            </div>
            <CButton type="submit">Verify</CButton>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OTP;
