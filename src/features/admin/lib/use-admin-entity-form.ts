"use client";

import { useState } from "react";

/**
 * Shared "inline add/edit" state machine for admin CRUD managers
 * (categories, brands, variants, ...): null = form closed, "new" = add
 * mode, an id = editing that entity. One implementation, reused instead
 * of re-derived per manager.
 */
export function useAdminEntityForm<TForm>(emptyForm: TForm) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);
  const [formError, setFormError] = useState("");

  function openAddForm() {
    setEditingId("new");
    setForm(emptyForm);
    setFormError("");
  }

  function openEditForm(id: string, values: TForm) {
    setEditingId(id);
    setForm(values);
    setFormError("");
  }

  function closeForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  return {
    editingId,
    isNew: editingId === "new",
    isOpen: editingId !== null,
    form,
    setForm,
    formError,
    setFormError,
    openAddForm,
    openEditForm,
    closeForm,
  };
}
