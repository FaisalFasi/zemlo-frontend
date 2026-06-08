"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/ui/input-otp";

type InputOTPProps = {
  value: string;
  setValue: (value: string) => void;
};

export function InputOTPPattern({ value, setValue }: InputOTPProps) {
  return (
    <div>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
        className="gap-4"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={1} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={2} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={3} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={4} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
        <InputOTPGroup>
          <InputOTPSlot index={5} className=" w-12 h-12 text-2xl font-bold" />
        </InputOTPGroup>
      </InputOTP>
      <div className="pt-2 ">
        {value === "" ? (
          <>Please enter Your one-time OTP</>
        ) : (
          <>You enterd : {value}</>
        )}
      </div>
    </div>
  );
}
