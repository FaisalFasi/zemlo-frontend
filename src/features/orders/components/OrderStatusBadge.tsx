/**
 * Colored pill showing an order or payment status in human language.
 * Used by the order list, order detail and (later) admin orders table —
 * styling lives here once instead of being copied per screen.
 */
import { cn } from "@/lib/utils";

import {
  getOrderStatusPresentation,
  getPaymentStatusPresentation,
} from "../lib/order-status";
import type {
  OrderPaymentStatus,
  OrderStatus,
} from "../types/order.types";

type OrderStatusBadgeProps =
  | { kind: "order"; status: OrderStatus }
  | { kind: "payment"; status: OrderPaymentStatus };

export default function OrderStatusBadge(props: OrderStatusBadgeProps) {
  const presentation =
    props.kind === "order"
      ? getOrderStatusPresentation(props.status)
      : getPaymentStatusPresentation(props.status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        presentation.className,
      )}
    >
      {presentation.label}
    </span>
  );
}
