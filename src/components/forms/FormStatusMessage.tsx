import { AlertCircle, CheckCircle2 } from "lucide-react";

type FormStatusMessageProps = {
  type: "success" | "error";
  title?: string;
  message: string;
};

export default function FormStatusMessage({
  type,
  title,
  message,
}: FormStatusMessageProps) {
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={
        type === "success"
          ? "rounded-2xl bg-success-soft px-4 py-3 text-sm text-success"
          : "rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
      }
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 size-4 shrink-0" />

        <div>
          {title ? <p className="font-medium">{title}</p> : null}
          <p className={title ? "mt-1 leading-6" : "leading-6"}>{message}</p>
        </div>
      </div>
    </div>
  );
}
