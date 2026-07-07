import { checkoutPaymentMethods } from "../types/checkout.types";
import type { CheckoutFormValues } from "../schemas/checkout.schema";
import type { CheckoutFromCartInput } from "../types/checkout.types";

export function checkoutFormValuesToInput(
  values: CheckoutFormValues,
): CheckoutFromCartInput {
  const shippingAddress = {
    firstName: values.firstName,
    lastName: values.lastName,
    company: values.company,
    phone: values.phone,
    street: values.street,
    apartment: values.apartment,
    city: values.city,
    state: values.state,
    zipCode: values.zipCode,
    country: values.country,
  };

  return {
    guestEmail: values.email,
    guestPhone: values.phone,
    guestFirstName: values.firstName,
    guestLastName: values.lastName,
    shippingAddress,
    paymentMethod: checkoutPaymentMethods.STRIPE,
    customerNote: values.customerNote,
  };
}
