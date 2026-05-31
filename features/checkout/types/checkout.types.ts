export type CheckoutPaymentMethod = "STRIPE" | "CASH_ON_DELIVERY";

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type CheckoutFromCartInput = {
  guestEmail: string;
  guestPhone: string;
  guestFirstName: string;
  guestLastName: string;
  shippingAddress: CheckoutAddress;
  billingAddress?: CheckoutAddress;
  paymentMethod: CheckoutPaymentMethod;
  customerNote?: string;
};

export type CheckoutFromCartResponse = {
  orderId?: string;
  orderNumber?: string;
  paymentId?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  amount?: number;
  currency?: string;
  status?: string;
  message?: string;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discount: number;
    total: number;
  };
  payment?: {
    id: string;
    method: string;
    status: string;
    amount: number;
    currency: string;
  };
  nextStep?: string;
};
