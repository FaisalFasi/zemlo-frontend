/**
 * Human-readable labels + badge styling for order status codes.
 *
 * The backend sends raw codes ("PROCESSING", "SHIPPED"); customers should
 * see friendly text with a colored badge instead. One shared mapping —
 * order list, order detail and (later) admin all read from here.
 *
 * Record<OrderStatus, ...> makes TypeScript fail the build if the backend
 * adds a status we haven't mapped; the fallback keeps unknown values from
 * ever crashing the UI at runtime.
 */
import type { OrderPaymentStatus, OrderStatus } from "../types/order.types";

type StatusPresentation = {
  label: string;
  className: string;
};

const FALLBACK_PRESENTATION: StatusPresentation = {
  label: "Unknown",
  className: "bg-muted text-muted-foreground",
};

const ORDER_STATUS_PRESENTATION: Record<OrderStatus, StatusPresentation> = {
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  CONFIRMED: { label: "Confirmed", className: "bg-sky-100 text-sky-800" },
  PROCESSING: { label: "Processing", className: "bg-sky-100 text-sky-800" },
  SHIPPED: { label: "Shipped", className: "bg-indigo-100 text-indigo-800" },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-100 text-emerald-800",
  },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

const PAYMENT_STATUS_PRESENTATION: Record<
  OrderPaymentStatus,
  StatusPresentation
> = {
  PENDING: {
    label: "Payment pending",
    className: "bg-amber-100 text-amber-800",
  },
  PAID: { label: "Paid", className: "bg-emerald-100 text-emerald-800" },
  FAILED: { label: "Payment failed", className: "bg-red-100 text-red-800" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground" },
  REFUNDED: { label: "Refunded", className: "bg-violet-100 text-violet-800" },
};

export function getOrderStatusPresentation(status: OrderStatus) {
  return ORDER_STATUS_PRESENTATION[status] ?? FALLBACK_PRESENTATION;
}

export function getPaymentStatusPresentation(status: OrderPaymentStatus) {
  return PAYMENT_STATUS_PRESENTATION[status] ?? FALLBACK_PRESENTATION;
}
