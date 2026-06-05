type FormFieldErrorProps = {
  message?: string;
};

export default function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null;

  return <p className="mt-2 text-xs leading-5 text-destructive">{message}</p>;
}
