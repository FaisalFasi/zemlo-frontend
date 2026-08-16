"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

type AdminFormActionsProps = {
  isSaving: boolean;
  savingLabel: string;
  idleLabel: string;
  onCancel: () => void;
};

// Shared Save/Cancel row for admin inline add/edit forms — one spinner
// treatment, not re-implemented per manager.
export default function AdminFormActions({
  isSaving,
  savingLabel,
  idleLabel,
  onCancel,
}: AdminFormActionsProps) {
  return (
    <div className="mt-4 flex gap-2">
      <Button type="submit" disabled={isSaving} className="rounded-full">
        {isSaving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {savingLabel}
          </>
        ) : (
          idleLabel
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="rounded-full"
      >
        Cancel
      </Button>
    </div>
  );
}
