import FieldInfo from "@/shared/FieldInfo";

import {
  productFieldHelp,
  type ProductFieldHelpKey,
} from "../data/product-field-help";

type ProductFieldLabelProps = {
  htmlFor?: string;
  label: string;
  infoKey: ProductFieldHelpKey;
};

export default function ProductFieldLabel({
  htmlFor,
  label,
  infoKey,
}: ProductFieldLabelProps) {
  const info = productFieldHelp[infoKey];

  return (
    <label
      htmlFor={htmlFor}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
    >
      {label}
      <FieldInfo
        title={info.title}
        description={info.description}
        example={"example" in info ? info.example : undefined}
      />
    </label>
  );
}
