/**
 * Orders API wrapper (customer side).
 *
 * Components never call Orval-generated functions directly (see
 * docs/ARCHITECTURE.md) — this thin wrapper is the stable boundary that
 * survives `npm run api:generate` regenerations, mirroring cart-api.ts.
 *
 * Auth: the /api/backend proxy attaches the bearer token from the httpOnly
 * customer session cookie, so no token handling is needed here.
 */
import {
  ordersControllerFindMyOrderByOrderNumber,
  ordersControllerFindMyOrders,
} from "@/shared/api/generated/orders/orders";

import type { OrderDetail, OrderSummary } from "../types/order.types";

export async function getMyOrders(): Promise<OrderSummary[]> {
  return ordersControllerFindMyOrders() as Promise<OrderSummary[]>;
}

export async function getMyOrderByNumber(
  orderNumber: string,
): Promise<OrderDetail> {
  return ordersControllerFindMyOrderByOrderNumber(
    orderNumber,
  ) as Promise<OrderDetail>;
}
