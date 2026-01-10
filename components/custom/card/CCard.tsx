import Image from "next/image";
import { CButton } from "../button/CButton";

const CCard = () => {
  return (
    <div className="max-h-full h-full w-50 md:w-75">
      <div className="relative w-50 h-50 md:w-75 md:h-75 rounded-2xl">
        <Image
          src={"/images/products/p1/tshirt.png"}
          alt="shirt"
          fill
          className="object-contain"
          quality={90}
        />
      </div>
      <div>
        <span className="text-xs md:text-base font-bold">
          T-SHIRT WITH TAPE DETAILS
        </span>
        <div className="flex gap-8">
          <span>4/5</span>
          <span>**** </span>
        </div>
        <p className="text-black text-[27px] font-bold">$100</p>
        <CButton className="bg-yellow-400 text-black rounded-2xl">
          Add to basket
        </CButton>
      </div>
    </div>
  );
};
export default CCard;
