import type { FinanceEntry, MonthlyFinancePoint } from '@/types';

// Faixa da mensalidade registrada pelo próprio filho (validada também no banco).
export const MENSALIDADE_MIN_CENTS = 7000;
export const MENSALIDADE_MAX_CENTS = 10000;

/** Lançamentos confirmados: pendentes (mensalidade aguardando comprovante) não entram nos totais. */
function confirmed(entries: FinanceEntry[]): FinanceEntry[] {
  return entries.filter((entry) => entry.status !== 'pendente');
}

export const FINANCE_INCOME_CATEGORIES = [
  { value: 'mensalidade', label: 'Mensalidade' },
  { value: 'doacao', label: 'Doação' },
  { value: 'evento', label: 'Evento' },
  { value: 'outros', label: 'Outros' },
];

export const FINANCE_EXPENSE_CATEGORIES = [
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'agua', label: 'Água' },
  { value: 'energia', label: 'Energia' },
  { value: 'material', label: 'Material' },
  { value: 'evento', label: 'Evento' },
  { value: 'outros', label: 'Outros' },
];

export function financeCategoryLabel(category: string): string {
  const known = [...FINANCE_INCOME_CATEGORIES, ...FINANCE_EXPENSE_CATEGORIES].find(
    (option) => option.value === category,
  );
  if (known) return known.label;
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
}

export function formatBRL(amountCents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountCents / 100);
}

/** '+ R$ 90,00' / '- R$ 186,40' conforme o tipo do lançamento. */
export function formatEntryAmount(entry: FinanceEntry): string {
  const prefix = entry.type === 'entrada' ? '+' : '-';
  return `${prefix} ${formatBRL(entry.amount_cents)}`;
}

/** '123,45' | '123.45' -> 12345 centavos. Retorna null se inválido. */
export function parseBRLToCents(value: string): number | null {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

/** '2026-07-21' -> '21/07/2026' sem problemas de fuso horário. */
export function formatFinanceDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function currentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  // Dia 0 do mês seguinte = último dia real do mês corrente (28–31).
  const lastDay = String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0');
  return { start: `${now.getFullYear()}-${month}-01`, end: `${now.getFullYear()}-${month}-${lastDay}` };
}

const MONTH_SHORT_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Série mensal (valores em reais) dos últimos `count` meses, mais antigo primeiro. */
export function buildMonthlySeries(entries: FinanceEntry[], count = 6): MonthlyFinancePoint[] {
  const now = new Date();
  const series: MonthlyFinancePoint[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    series.push({ month: MONTH_SHORT_PT[date.getMonth()], income: 0, expense: 0 });
  }

  const firstMonth = new Date(now.getFullYear(), now.getMonth() - (count - 1), 1);
  for (const entry of confirmed(entries)) {
    const [year, month] = entry.entry_date.split('-').map(Number);
    const entryMonth = new Date(year, month - 1, 1);
    const index =
      (entryMonth.getFullYear() - firstMonth.getFullYear()) * 12 +
      (entryMonth.getMonth() - firstMonth.getMonth());
    if (index < 0 || index >= count) continue;
    if (entry.type === 'entrada') series[index].income += entry.amount_cents / 100;
    else series[index].expense += entry.amount_cents / 100;
  }

  return series;
}

export function summarizeMonth(entries: FinanceEntry[], monthStart: string, monthEnd: string) {
  const inMonth = confirmed(entries).filter((entry) => entry.entry_date >= monthStart && entry.entry_date <= monthEnd);
  const income = inMonth.filter((e) => e.type === 'entrada').reduce((t, e) => t + e.amount_cents, 0);
  const expense = inMonth.filter((e) => e.type === 'saida').reduce((t, e) => t + e.amount_cents, 0);
  const mensalidades = inMonth
    .filter((e) => e.type === 'entrada' && e.category === 'mensalidade')
    .reduce((t, e) => t + e.amount_cents, 0);
  return { income, expense, balance: income - expense, mensalidades, entries: inMonth };
}

export type ExpenseCategorySlice = { label: string; percent: number; totalCents: number };

export function expenseByCategory(entries: FinanceEntry[]): ExpenseCategorySlice[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (entry.type !== 'saida') continue;
    totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount_cents);
  }
  const grand = [...totals.values()].reduce((t, v) => t + v, 0);
  return [...totals.entries()]
    .map(([category, totalCents]) => ({
      label: financeCategoryLabel(category),
      totalCents,
      percent: grand > 0 ? Math.round((totalCents / grand) * 100) : 0,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);
}
