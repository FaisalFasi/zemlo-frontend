// Shared "delete this category/brand?" confirm copy — both managers warn
// about products still assigned before deleting (UX heads-up; the backend
// enforces the real guard).
export function buildCatalogDeleteConfirmMessage(
  entityLabel: string,
  name: string,
  productCount: number,
): string {
  const productWarning =
    productCount > 0
      ? ` ${productCount} product${productCount === 1 ? "" : "s"} currently use this ${entityLabel}.`
      : "";

  return `Delete ${entityLabel} "${name}"?${productWarning} This cannot be undone.`;
}
