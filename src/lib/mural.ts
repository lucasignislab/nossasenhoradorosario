import type { MuralItem, MuralItemCategory, MuralPledge } from '@/types';

export const MURAL_ITEM_CATEGORIES: { value: MuralItemCategory; label: string }[] = [
  { value: 'velas', label: 'Velas' },
  { value: 'flores', label: 'Flores' },
  { value: 'mantimentos', label: 'Mantimentos' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'outros', label: 'Outros' },
];

export function muralCategoryLabel(category: string): string {
  return MURAL_ITEM_CATEGORIES.find((option) => option.value === category)?.label ?? category;
}

/** Formata quantidade sem casas decimais desnecessárias: 2 → '2', 1.5 → '1,5'. */
export function formatMuralQuantity(quantity: number, unit: string): string {
  const formatted = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1).replace('.', ',');
  return `${formatted} ${unit}`;
}

/** Total já comprometido de um item. */
export function pledgedTotal(itemId: string, pledges: MuralPledge[]): number {
  return pledges
    .filter((pledge) => pledge.item_id === itemId)
    .reduce((total, pledge) => total + Number(pledge.quantity), 0);
}

/** Percentual de cobertura do item (0–100). Sem meta definida, retorna null. */
export function itemProgress(item: MuralItem, pledges: MuralPledge[]): number | null {
  if (!item.quantity_total) return null;
  return Math.min(100, Math.round((pledgedTotal(item.id, pledges) / Number(item.quantity_total)) * 100));
}
