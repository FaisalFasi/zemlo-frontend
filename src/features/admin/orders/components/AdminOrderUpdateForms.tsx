/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Do forms — (1) order/payment/fulfillment status badalna
 * (+ optional note jo status history mein jata hai), (2) shipping info
 * (carrier, tracking number/URL) update karna.
 * REASON: Store owner ka fulfilment tool: order ko CONFIRMED → SHIPPED
 * karna aur tracking daalna (customer ko wahi tracking apne order page
 * par dikhta hai). Dropdown options generated enums se hain — backend
 * naya status add kare to regenerate par yahan khud aa jayega.
 * RISK: Zero — sirf Save dabane par PATCH hota hai; backend
 * ORDERS_UPDATE permission enforce karta hai.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  UpdateAdminOrderStatusDtoStatus,
  UpdateAdminOrderStatusDtoPaymentStatus,
  UpdateAdminOrderStatusDtoFulfillmentStatus,
} from "@/shared/api/generated/schemas";
import { Button } from "@/shared/ui/button";

import { useAdminPermission } from "@/features/admin/auth/hooks/use-admin-auth";
import {
  useUpdateOrderShippingMutation,
  useUpdateOrderStatusMutation,
} from "../hooks/use-admin-orders";
import type { AdminOrderDetail } from "../types/admin-order.types";

const inputClassName =
  "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-foreground";

const selectClassName = inputClassName;

type AdminOrderUpdateFormsProps = {
  order: AdminOrderDetail;
};

export default function AdminOrderUpdateForms({
  order,
}: AdminOrderUpdateFormsProps) {
  const canUpdate = useAdminPermission("orders.update");

  if (!canUpdate) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Your role does not have permission to update this order.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusForm order={order} />
      <ShippingForm order={order} />
    </div>
  );
}

function StatusForm({ order }: { order: AdminOrderDetail }) {
  const statusMutation = useUpdateOrderStatusMutation(order.id);

  const [status, setStatus] = useState<string>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<string>(
    order.paymentStatus,
  );
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>(
    order.fulfillmentStatus,
  );
  const [note, setNote] = useState("");

  // Local state only initializes from `order` on mount — without this, a
  // successful save (which refetches the order) never updates what the
  // dropdowns display, so the form can silently drift from the persisted
  // state (and a second, unrelated save could revert the first change).
  useEffect(() => {
    setStatus(order.status);
    setPaymentStatus(order.paymentStatus);
    setFulfillmentStatus(order.fulfillmentStatus);
  }, [order.status, order.paymentStatus, order.fulfillmentStatus]);

  function handleFieldChange<T>(setter: (value: T) => void) {
    return (value: T) => {
      // A stale "Status updated."/error banner from a previous save must
      // not linger once the admin starts making a new selection — it reads
      // as if the NEW (unsaved) choice already went through.
      if (statusMutation.isSuccess || statusMutation.isError) {
        statusMutation.reset();
      }

      setter(value);
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    statusMutation.mutate({
      status: status as keyof typeof UpdateAdminOrderStatusDtoStatus,
      paymentStatus:
        paymentStatus as keyof typeof UpdateAdminOrderStatusDtoPaymentStatus,
      fulfillmentStatus:
        fulfillmentStatus as keyof typeof UpdateAdminOrderStatusDtoFulfillmentStatus,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-card p-6"
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Update status
      </h2>

      <div className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">Order status</span>
          <select
            value={status}
            onChange={(event) =>
              handleFieldChange(setStatus)(event.target.value)
            }
            className={`mt-1 ${selectClassName}`}
          >
            {Object.values(UpdateAdminOrderStatusDtoStatus).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Payment status</span>
          <select
            value={paymentStatus}
            onChange={(event) =>
              handleFieldChange(setPaymentStatus)(event.target.value)
            }
            className={`mt-1 ${selectClassName}`}
          >
            {Object.values(UpdateAdminOrderStatusDtoPaymentStatus).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Fulfillment</span>
          <select
            value={fulfillmentStatus}
            onChange={(event) =>
              handleFieldChange(setFulfillmentStatus)(event.target.value)
            }
            className={`mt-1 ${selectClassName}`}
          >
            {Object.values(UpdateAdminOrderStatusDtoFulfillmentStatus).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </select>
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Note (optional)</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            placeholder="e.g. Confirmed by phone"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </label>
      </div>

      {statusMutation.isError ? (
        <p className="mt-3 text-sm text-red-600">
          {statusMutation.error instanceof Error
            ? statusMutation.error.message
            : "Could not update status."}
        </p>
      ) : null}

      {statusMutation.isSuccess ? (
        <p className="mt-3 text-sm text-emerald-700">Status updated.</p>
      ) : null}

      <Button
        type="submit"
        disabled={statusMutation.isPending}
        className="mt-4 rounded-full"
      >
        {statusMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save status"
        )}
      </Button>
    </form>
  );
}

function ShippingForm({ order }: { order: AdminOrderDetail }) {
  const shippingMutation = useUpdateOrderShippingMutation(order.id);

  const [shippingCarrier, setShippingCarrier] = useState(
    order.shippingCarrier ?? "",
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber ?? "",
  );
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");

  // Resync after a successful save refetches the order — see the matching
  // comment in StatusForm.
  useEffect(() => {
    setShippingCarrier(order.shippingCarrier ?? "");
    setTrackingNumber(order.trackingNumber ?? "");
    setTrackingUrl(order.trackingUrl ?? "");
  }, [order.shippingCarrier, order.trackingNumber, order.trackingUrl]);

  function handleFieldChange<T>(setter: (value: T) => void) {
    return (value: T) => {
      if (shippingMutation.isSuccess || shippingMutation.isError) {
        shippingMutation.reset();
      }

      setter(value);
    };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Send trimmed values AS-IS (including "") rather than omitting the
    // key when blank — omitting means "leave unchanged" in a PATCH, so
    // clearing a field here used to silently keep the old value.
    shippingMutation.mutate({
      shippingCarrier: shippingCarrier.trim(),
      trackingNumber: trackingNumber.trim(),
      trackingUrl: trackingUrl.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-card p-6"
    >
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Shipping & tracking
      </h2>

      <div className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">Carrier</span>
          <input
            type="text"
            value={shippingCarrier}
            onChange={(event) =>
              handleFieldChange(setShippingCarrier)(event.target.value)
            }
            placeholder="e.g. DHL"
            className={`mt-1 ${inputClassName}`}
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Tracking number</span>
          <input
            type="text"
            value={trackingNumber}
            onChange={(event) =>
              handleFieldChange(setTrackingNumber)(event.target.value)
            }
            className={`mt-1 ${inputClassName}`}
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Tracking URL</span>
          <input
            type="url"
            value={trackingUrl}
            onChange={(event) =>
              handleFieldChange(setTrackingUrl)(event.target.value)
            }
            placeholder="https://..."
            className={`mt-1 ${inputClassName}`}
          />
        </label>
      </div>

      {shippingMutation.isError ? (
        <p className="mt-3 text-sm text-red-600">
          {shippingMutation.error instanceof Error
            ? shippingMutation.error.message
            : "Could not update shipping."}
        </p>
      ) : null}

      {shippingMutation.isSuccess ? (
        <p className="mt-3 text-sm text-emerald-700">Shipping updated.</p>
      ) : null}

      <Button
        type="submit"
        disabled={shippingMutation.isPending}
        className="mt-4 rounded-full"
      >
        {shippingMutation.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save shipping"
        )}
      </Button>
    </form>
  );
}
