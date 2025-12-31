import { CButton } from "@/components/custom/button/CButton";
import { CInput } from "@/components/custom/input/CInput";
import Image from "next/image";

const Signup = () => {
  return (
    <div className="w-full h-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-screen hidden md:block">
        <Image
          src={"/images/auth/signup.png"}
          alt="Login Image"
          fill
          className="object-cover "
          sizes="100vw"
          priority
        />
      </div>
      <div className="min-h-screen flex flex-col justify-center p-2 lg:px-10 py-40 md:py-0">
        <div className="w-fit md:w-full flex flex-col  justify-start ">
          <h2>Create New Account</h2>
          <p>Please enter details</p>
        </div>
        <div className="w-full max-w-100 md:max-w-111">
          <form
            action=""
            className="w-full flex flex-col gap-4   md:max-w-full lg:max-w-111 "
          >
            <CInput
              type="text"
              placeholder="first name"
              id="first_name"
              label="First Name"
            />
            <CInput
              type="text"
              placeholder="last name"
              id="last_name"
              label="Last Name"
            />
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
            <div className="flex justify-between items-center text-sm hover:cursor-pointer">
              <div className="flex gap-4 items-center justify-center">
                <CInput type="checkbox" />
                <span className="text-xs lg:text-[1rem]">
                  {` I agree to the `}
                  <span className=" font-bold">Terms & Conditions</span>
                </span>
              </div>
            </div>
            <CButton>Signup </CButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
